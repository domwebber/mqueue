import {
  IncomingQueueAdapter,
  IncomingQueueMessageAdapterListener,
} from "@mqueue/queue";

export default class PubSubIncomingQueue implements IncomingQueueAdapter {
  public type = "pubsub";

  constructor() {}

  public async healthcheck(): Promise<void> {}

  public async close(): Promise<void> {}

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {}
}
