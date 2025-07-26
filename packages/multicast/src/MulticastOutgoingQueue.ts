import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";

type MulticastOutgoingQueueFilter = (
  adapters: OutgoingQueueAdapter[],
  message: QueueMessage,
) => OutgoingQueueAdapter[];

export interface MulticastOutgoingQueueOptions {
  filter?: MulticastOutgoingQueueFilter;
}

export default class MulticastOutgoingQueue implements OutgoingQueueAdapter {
  public type = "multicast";

  protected _filter: MulticastOutgoingQueueFilter;

  constructor(
    protected _adapters: OutgoingQueueAdapter[],
    options: MulticastOutgoingQueueOptions = {},
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
