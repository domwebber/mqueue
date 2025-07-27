import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";

export default class PubSubOutgoingQueue implements OutgoingQueueAdapter {
  public type = "pubsub";

  constructor() {}

  public async sendMessage(message: QueueMessage): Promise<void> {}

  public async healthcheck(): Promise<void> {}

  public async close(): Promise<void> {}
}
