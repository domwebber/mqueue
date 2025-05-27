import { OutgoingQueue, QueueMessage } from "@mqueue/queue";

export default class MulticastOutgoingQueue implements OutgoingQueue {
  public type = "multicast";

  constructor(protected _adapters: OutgoingQueue[]) {}

  public async healthcheck() {
    await Promise.all(this._adapters.map((adapter) => adapter.healthcheck()));
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    await Promise.all(
      this._adapters.map((adapter) => adapter.sendMessage(message)),
    );
  }

  public async close() {
    await Promise.all(this._adapters.map((adapter) => adapter.close()));
  }
}
