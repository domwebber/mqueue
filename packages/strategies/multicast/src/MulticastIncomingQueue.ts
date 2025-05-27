import {
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
} from "@mqueue/queue";

type MulticastIncomingQueueFilter = (
  adapters: IncomingQueueAdapter[],
) => IncomingQueueAdapter[];

export interface MulticastIncomingQueueOptions {
  filter?: MulticastIncomingQueueFilter;
}

export default class MulticastIncomingQueue implements IncomingQueueAdapter {
  public type = "multicast";

  protected _filter: MulticastIncomingQueueFilter;

  constructor(
    protected _adapters: IncomingQueueAdapter[],
    options: MulticastIncomingQueueOptions = {},
  ) {
    this._filter = options.filter ?? ((adapters) => adapters);
  }

  public async healthcheck() {
    await Promise.all(this._adapters.map((adapter) => adapter.healthcheck()));
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    await Promise.all(
      this._filter(this._adapters).map((adapter) => adapter.consume(callback)),
    );
  }

  public async close() {
    await Promise.all(this._adapters.map((adapter) => adapter.close()));
  }
}
