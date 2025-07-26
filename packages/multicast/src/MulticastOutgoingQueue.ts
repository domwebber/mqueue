import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";

type MulticastOutgoingQueueFilter<
  T extends [OutgoingQueueAdapter, ...OutgoingQueueAdapter[]],
> = (adapters: T, message: QueueMessage) => OutgoingQueueAdapter[];

export interface MulticastOutgoingQueueOptions<
  T extends [OutgoingQueueAdapter, ...OutgoingQueueAdapter[]],
> {
  filter?: MulticastOutgoingQueueFilter<T>;
}

export default class MulticastOutgoingQueue<
  T extends [OutgoingQueueAdapter, ...OutgoingQueueAdapter[]],
> implements OutgoingQueueAdapter
{
  public type = "multicast";

  protected _filter: MulticastOutgoingQueueFilter<T>;

  constructor(
    protected _adapters: T,
    options: MulticastOutgoingQueueOptions<T> = {},
  ) {
    this._filter = options.filter ?? ((adapters) => adapters);
  }

  public async healthcheck() {
    await Promise.all(this._adapters.map((adapter) => adapter.healthcheck()));
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    await Promise.all(
      this._filter(this._adapters, message).map((adapter) =>
        adapter.sendMessage(message),
      ),
    );
  }

  public async close() {
    await Promise.all(this._adapters.map((adapter) => adapter.close()));
  }
}
