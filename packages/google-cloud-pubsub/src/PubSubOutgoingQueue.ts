import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { PubSub, Topic } from "@google-cloud/pubsub";

export default class PubSubOutgoingQueue implements OutgoingQueueAdapter {
  public type = "pubsub";

  constructor(
    public client: PubSub,
    public topic: Topic,
  ) {}

  public static async connect(topicName: string) {
    const client = new PubSub();
    const topic = client.topic(topicName);
    return new this(client, topic);
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    const attributes: Record<string, string> = {};
    for (const [key, value] of Object.entries(message.headers)) {
      if (value === undefined) continue;
      attributes[key] = Array.isArray(value) ? value.join(";") : value;
    }

    await this.topic.publishMessage({
      data: message.body,
      attributes,
    });
  }

  public async healthcheck(): Promise<void> {
    if (!this.client.isOpen) {
      throw new Error("Pub/Sub Receiver unexpectedly disconnected");
    }
  }

  public async close(): Promise<void> {
    await this.client.close();
  }
}
