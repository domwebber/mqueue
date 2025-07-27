import {
  IncomingQueueAdapter,
  IncomingQueueMessageAdapterListener,
} from "@mqueue/queue";

type MulticastIncomingQueueFilter<
  T extends [IncomingQueueAdapter, ...IncomingQueueAdapter[]],
> = (adapters: T) => IncomingQueueAdapter[];

export interface MulticastIncomingQueueOptions<
  T extends [IncomingQueueAdapter, ...IncomingQueueAdapter[]],
> {
  filter?: MulticastIncomingQueueFilter<T>;
}

export default class MulticastIncomingQueue<
  T extends [IncomingQueueAdapter, ...IncomingQueueAdapter[]],
> implements IncomingQueueAdapter
{
  public type = "multicast";

  protected _filter: MulticastIncomingQueueFilter<T>;

  constructor(
    protected _adapters: T,
    options: MulticastIncomingQueueOptions<T> = {},
  ) {
    this._filter = options.filter ?? ((adapters) => adapters);
  }

  public async healthcheck() {
    await Promise.all(this._adapters.map((adapter) => adapter.healthcheck()));
  }

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
    await Promise.all(
      this._filter(this._adapters).map((adapter) => adapter.consume(callback)),
    );
  }

  public async close() {
    await Promise.all(this._adapters.map((adapter) => adapter.close()));
  }
}
