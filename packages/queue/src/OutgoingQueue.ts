import OutgoingQueueAdapter from "./Adapter/OutgoingQueueAdapter.js";
import QueueMessage from "./QueueMessage.js";
import { HookSet, resolveHooks } from "./utils/hooks.js";

export interface SendMessageOptions extends Omit<QueueMessage, "body"> {
  body: Buffer | string;
}

export default class OutgoingQueue {
  public on = {
    send: new HookSet<SendMessageOptions>(),
  };

  constructor(protected _adapter: OutgoingQueueAdapter) {}

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

  public async sendMessage(message: SendMessageOptions): Promise<void> {
    const body =
      typeof message.body === "string"
        ? Buffer.from(message.body)
        : message.body;

    const sendMessageOptions = {
      ...message,
      body,
    };

    await resolveHooks(sendMessageOptions, this.on.send);

    return this._adapter.sendMessage({
      ...message,
      body,
    });
  }
}
