import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { Connection, ConnectionOptions, Sender } from "rhea-promise";

export interface RheaOutgoingQueueConnectOptions {
  target: {
    address: string;
  };
}

export default class RheaOutgoingQueue implements OutgoingQueueAdapter {
  public type = "rhea";

  constructor(public sender: Sender) {}

  public static async connect(
    connectionOptions: ConnectionOptions,
    { target }: RheaOutgoingQueueConnectOptions,
  ) {
    const connection = new Connection({
      reconnect: true,
      port: 5672,
      ...connectionOptions,
    });

    await connection.open();
    const sender = await connection.createSender({
      target,
    });

    return new this(sender);
  }

  public async healthcheck() {
    if (!this.sender.isOpen()) {
      throw new Error("AMQPv1.0 Sender unexpectedly disconnected");
    }
  }

  public async close() {
    await this.sender.close();
    await this.sender.connection.close();
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    const delivery = this.sender.send({
      body: message.body, // .toString(AMQP10OutgoingQueue.BODY_ENCODING),
      // content_type: "application/json",
      // content_encoding: AMQP10OutgoingQueue.BODY_ENCODING,
      application_properties: message.headers,
    });

    console.info("[Queue-Message] Delivery ID:" + delivery.id);
  }
}
