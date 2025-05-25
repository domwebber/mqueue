import QueueAdapter from "./QueueAdapter.js";

export default class MQueue implements QueueAdapter {
  constructor(protected _adapter: QueueAdapter) {}

  public get type() {
    return this._adapter.type;
  }

  public healthcheck(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public shutdown(): Promise<void> {
    return this._adapter.healthcheck();
  }
}
