import OutgoingQueueAdapter from "./Adapter/OutgoingQueueAdapter.js";
import QueueMessage from "./QueueMessage.js";
import { HookSet, resolveHooks } from "./utils/hooks.js";

export interface SendMessageOptions extends Omit<QueueMessage, "body"> {
  body: Buffer | string;
}

export default class OutgoingQueue {
  public on = {
    send: new HookSet<QueueMessage>(),
    healthcheck: new HookSet(),
    close: new HookSet(),
  };

  constructor(protected _adapter: OutgoingQueueAdapter) {}

  public async isConnected(): Promise<boolean> {
    return this.healthcheck()
      .then(() => true)
      .catch(() => false);
  }

  public async healthcheck(): Promise<void> {
    await resolveHooks(this.on.healthcheck, undefined);
    return this._adapter.healthcheck();
  }

  public async close(): Promise<void> {
    await resolveHooks(this.on.close, undefined);
    return this._adapter.healthcheck();
  }

  public async sendMessage(message: SendMessageOptions): Promise<void> {
    const body =
      typeof message.body === "string"
        ? Buffer.from(message.body)
        : message.body;

    const sendMessageOptions = await resolveHooks(this.on.send, {
      ...message,
      body,
    });

    return this._adapter.sendMessage(sendMessageOptions);
  }
}
