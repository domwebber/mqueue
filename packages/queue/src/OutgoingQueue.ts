import OutgoingQueueAdapter from "./Adapter/OutgoingQueueAdapter.js";
import QueueMessage from "./QueueMessage.js";

export default class OutgoingQueue implements OutgoingQueueAdapter {
  constructor(protected _adapter: OutgoingQueueAdapter) {}

  public get type() {
    return this._adapter.type;
  }

  public healthcheck(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public shutdown(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public sendMessage(message: QueueMessage): Promise<void> {
    return this._adapter.sendMessage(message);
  }
}
