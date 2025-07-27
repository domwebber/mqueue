import {
  IncomingQueueAdapter,
  IncomingQueueMessageAdapterListener,
} from "@mqueue/queue";
import { connect, Options, type Channel } from "amqplib";

export default class AmqplibIncomingQueue implements IncomingQueueAdapter {
  public type = "amqplib";

  /**
   * Use a pre-connected Amqplib Channel to initialise MQueue.
   *
   * Note: You probably want `AmqplibQueue.Incoming.connect()`
   *
   * ```ts
   * import { connect } from "amqplib";
   * const connection = await connect(url);
   * const channel = await connection.createChannel();
   * const incomingQueue = new MQueue.Incoming(
   *   new AmqplibQueue.Incoming(channel, "queue-name")
   * );
   * ```
   */
  constructor(
    public channel: Channel,
    public queueName: string,
  ) {}

  /**
   * Connect to an AMQPv0.9.1 Queue and initialise MQueue.
   *
   * ```ts
   * const incomingQueue = new MQueue.Incoming(
   *   await AmqplibQueue.Incoming.connect(
   *     "amqp://rabbitmq:5271",
   *     "queue-name",
   *     { socketOptions: { timeout: 100_000 } },
   *   )
   * );
   * ```
   */
  public static async connect(
    url: string | Options.Connect,
    queueName: string,
    {
      socketOptions,
    }: {
      socketOptions?: Parameters<typeof connect>[1] & { timeout?: number };
    } = {},
  ) {
    const connection = await connect(url, socketOptions);
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

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
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
