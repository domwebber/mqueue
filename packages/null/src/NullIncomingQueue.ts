import { IncomingQueueAdapter } from "@mqueue/queue";

export default class NullIncomingQueue implements IncomingQueueAdapter {
  public type = "null";
  constructor() {}
  public async healthcheck(): Promise<void> {}
  public async close(): Promise<void> {}
  public async consume(): Promise<void> {}
}
