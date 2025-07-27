import { connect, type Channel, type Options as AmqplibOptions } from "amqplib";
import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";

export default class AmqplibOutgoingQueue implements OutgoingQueueAdapter {
  public type = "amqplib";

  /**
   * Use a pre-connected Amqplib Channel to initialise MQueue.
   *
   * Note: You probably want `AmqplibQueue.Outgoing.connect()`
   *
   * ```ts
   * import { connect } from "amqplib";
   * const connection = await connect(url);
   * const channel = await connection.createChannel();
   * const outgoingQueue = new MQueue.Outgoing(
   *   new AmqplibQueue.Outgoing(channel, "queue-name")
   * );
   * ```
   */
  constructor(
    public client: Channel,
    public queueName: string,
  ) {}

  /**
   * Connect to an AMQPv0.9.1 Queue and initialise MQueue.
   *
   * ```ts
   * const outgoingQueue = new MQueue.Outgoing(
   *   await AmqplibQueue.Outgoing.connect(
   *     "amqp://rabbitmq:5271",
   *     "queue-name",
   *     { socketOptions: { timeout: 100_000 } },
   *   )
   * );
   * ```
   */
  public static async connect(
    options: string | AmqplibOptions.Connect,
    queueName: string,
    {
      socketOptions,
    }: {
      socketOptions?: Parameters<typeof connect>[1] & { timeout?: number };
    } = {},
  ) {
    const connection = await connect(options, socketOptions);
    const channel = await connection.createChannel();
    return new this(channel, queueName);
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    const result = this.client.sendToQueue(this.queueName, message.body, {
      contentType: "application/json",
      contentEncoding: "binary",
      headers: message.headers,
    });

    if (!result) {
      throw new Error(`Message failed to send to ${this.type} queue`);
    }
  }

  public async healthcheck(): Promise<void> {
    await this.client
      .assertQueue(this.queueName, {
        durable: true,
      })
      .catch((error) => {
        throw error;
      });
  }

  public async close(): Promise<void> {
    await this.client.close();
    // await this._channel.connection.close();
  }
}
