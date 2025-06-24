import { OutgoingQueueAdapter } from "@mqueue/queue";

export default class NullOutgoingQueue implements OutgoingQueueAdapter {
  public type = "null";

  constructor() {}
  public async healthcheck(): Promise<void> {}
  public async close(): Promise<void> {}
  public async sendMessage(): Promise<void> {}
}
