import { IncomingQueue, IncomingQueueMessageListener } from "@mqueue/queue";

export default class MulticastIncomingQueue implements IncomingQueue {
  public type = "multicast";

  constructor(protected _adapters: IncomingQueue[]) {}

  public async healthcheck() {
    await Promise.all(this._adapters.map((adapter) => adapter.healthcheck()));
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    await Promise.all(
      this._adapters.map((adapter) => adapter.consume(callback)),
    );
  }

  public async close() {
    await Promise.all(this._adapters.map((adapter) => adapter.close()));
  }
}
