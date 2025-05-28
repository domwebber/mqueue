import {
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
} from "@mqueue/queue";
import { connect, Options, type Channel } from "amqplib";

export default class AmqplibIncomingQueue implements IncomingQueueAdapter {
  public type = "amqplib";

  constructor(
    protected _channel: Channel,
    protected _queueName: string,
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

  public async healthcheck() {
    await this._channel.assertQueue(this._queueName, {
      durable: true,
    });
  }

  public async close() {
    await this._channel.close();
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    await this._channel.consume(
      this._queueName,
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
            this._channel.ack(message);
          },
          reject: async () => {
            this._channel.nack(message, false, false);
          },
          message: {
            isRedelivered: message.fields.redelivered,
            headers: message.properties.headers ?? {},
            body: message.content,
          },
        }).catch((error) => {
          // Hoist error scope
          throw error;
        });
      },
      {
        // Disable automatic message acknowledgement
        noAck: false,
      },
    );
  }
}
