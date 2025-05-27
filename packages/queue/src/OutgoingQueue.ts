import OutgoingQueueAdapter from "./Adapter/OutgoingQueueAdapter.js";
import QueueMessage from "./QueueMessage.js";

export interface SendMessageOptions extends Omit<QueueMessage, "body"> {
  body: Buffer | string;
}

export default class OutgoingQueue {
  constructor(protected _adapter: OutgoingQueueAdapter) {}

  public get type() {
    return this._adapter.type;
  }

  public healthcheck(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public close(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public sendMessage(message: SendMessageOptions): Promise<void> {
    const body =
      typeof message.body === "string"
        ? Buffer.from(message.body)
        : message.body;

    return this._adapter.sendMessage({
      ...message,
      body,
    });
  }
}
