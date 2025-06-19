import IncomingQueueAdapter, {
  IncomingQueueMessageListener,
} from "./Adapter/IncomingQueueAdapter.js";

export default class IncomingQueue {
  constructor(protected _adapter: IncomingQueueAdapter) {}

  public async isConnected(): Promise<boolean> {
    return this.healthcheck()
      .then(() => true)
      .catch(() => false);
  }

  public healthcheck(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public close(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public consume(callback: IncomingQueueMessageListener): Promise<void> {
    return this._adapter.consume(callback);
  }
}
