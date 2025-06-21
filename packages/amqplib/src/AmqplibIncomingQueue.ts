import {
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
} from "@mqueue/queue";
import { connect, Options, type Channel } from "amqplib";

export default class AmqplibIncomingQueue implements IncomingQueueAdapter {
  public type = "amqplib";

  constructor(
    public channel: Channel,
    public queueName: string,
  ) {}

  public static async connect(
    url: string | Options.Connect,
    queueName: string,
    options?: unknown,
  ) {
    const connection = await connect(url, options);
    const connectionChannel = await connection.createChannel();
    await connectionChannel.prefetch(1);
    return new this(connectionChannel, queueName);
  }

  public async healthcheck(): Promise<void> {
    await this.channel.assertQueue(this.queueName, {
      durable: true,
    });
  }

  public async close(): Promise<void> {
    await this.channel.close();
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    await this.channel.consume(
      this.queueName,
      async (message) => {
        // Check whether the worker, message, or queue service was cancelled (rudimentary)
        if (message === null) {
          // this._logger.error(
          //   "Either the worker, message, or queue service was cancelled",
          // );
          return;
        }

        await callback({
          raw: message,
          accept: async () => {
            this.channel.ack(message);
          },
          reject: async () => {
            this.channel.nack(message, false, false);
          },
          transport: {
            name: this.queueName,
          },
          message: {
            isRedelivered: message.fields.redelivered,
            headers: message.properties.headers ?? {},
            body: message.content,
          },
        });
      },
      {
        // Disable automatic message acknowledgement
        noAck: false,
      },
    );
  }
}
