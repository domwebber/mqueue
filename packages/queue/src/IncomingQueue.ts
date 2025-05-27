import IncomingQueueAdapter, {
  IncomingQueueMessageListener,
} from "./Adapter/IncomingQueueAdapter.js";

export default class IncomingQueue implements IncomingQueueAdapter {
  constructor(protected _adapter: IncomingQueueAdapter) {}

  public get type() {
    return this._adapter.type;
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
