import { connect, type Channel, type Options as AmqplibOptions } from "amqplib";
import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";

interface AmqplibOutgoingQueueOptions {
  queueName: string;
}

export default class AmqplibOutgoingQueue implements OutgoingQueueAdapter {
  public type = "amqplib";
  public queueName: string;

  constructor(
    public client: Channel,
    { queueName }: AmqplibOutgoingQueueOptions,
  ) {
    this.queueName = queueName;
  }

  public static async connect(
    options: string | AmqplibOptions.Connect,
    queueName: string,
    { socketOptions }: { socketOptions: Parameters<typeof connect>[1] },
  ) {
    const connection = await connect(options, socketOptions);
    const channel = await connection.createChannel();
    return new this(channel, { queueName });
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    const result = this.client.sendToQueue(this.queueName, message.body, {
      contentType: "application/json",
      contentEncoding: "binary",
      headers: message.headers,
    });

    if (!result) {
      throw new Error(`Message failed to send to ${this.type} queue`);
      // throw OutgoingQueueMessageSendFailedError.caused();
    }
  }

  public async healthcheck() {
    await this.client
      .assertQueue(this.queueName, {
        durable: true,
      })
      .catch((error) => {
        throw error;
      });
  }

  public async close() {
    await this.client.close();
    // await this._channel.connection.close();
  }
}
