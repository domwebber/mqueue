import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { connectAsync, MqttClient, IPublishPacket } from "mqtt";

export default class MqttOutgoingQueue implements OutgoingQueueAdapter {
  public type = "mqtt";

  constructor(
    public client: MqttClient,
    public topic: string,
  ) {}

  public static async connect(
    topic: string,
    ...options: Parameters<typeof connectAsync>
  ) {
    const client = await connectAsync(...options);
    return new this(client, topic);
  }

  public async healthcheck(): Promise<void> {
    this.client.sendPing();

    if (
      (!this.client.connected && !this.client.reconnecting) ||
      this.client.disconnecting
    ) {
      throw new Error("MQTT Sender unexpectedly disconnected");
    }
  }

  public async close() {
    await this.client.endAsync();
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    await this.client.publishAsync(this.topic, message.body, {
      properties: {
        contentType: "application/json",
        userProperties: message.headers as Exclude<
          IPublishPacket["properties"],
          undefined
        >["userProperties"],
      },
    });
  }
}
