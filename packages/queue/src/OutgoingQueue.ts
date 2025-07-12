import OutgoingQueueAdapter from "./Adapter/OutgoingQueueAdapter.js";
import QueueMessage from "./QueueMessage.js";
import { Hook, HookSet, resolveHooks } from "./utils/hooks.js";

export interface OutgoingQueueOptions {
  onSend?: Hook<QueueMessage>[];
  onHealthcheck?: Hook<unknown>[];
  onBeforeClose?: Hook<unknown>[];
  onAfterClose?: Hook<unknown>[];
}

export interface SendMessageOptions extends Omit<QueueMessage, "body"> {
  body: Buffer | string;
}

export default class OutgoingQueue {
  public on = {
    send: new HookSet<QueueMessage>(),
    healthcheck: new HookSet(),
    beforeClose: new HookSet(),
    afterClose: new HookSet(),
  };

  constructor(
    public adapter: OutgoingQueueAdapter,
    options: OutgoingQueueOptions = {},
  ) {
    options.onSend?.map((hook) => this.on.send.add(hook));
    options.onHealthcheck?.map((hook) => this.on.healthcheck.add(hook));
    options.onBeforeClose?.map((hook) => this.on.beforeClose.add(hook));
    options.onAfterClose?.map((hook) => this.on.afterClose.add(hook));
  }

  public async isConnected(): Promise<boolean> {
    return this.healthcheck()
      .then(() => true)
      .catch(() => false);
  }

  public async healthcheck(): Promise<void> {
    await resolveHooks(this.on.healthcheck, undefined);
    return this.adapter.healthcheck();
  }

  public async close(): Promise<void> {
    await resolveHooks(this.on.beforeClose, undefined);
    this.adapter.close();
    await resolveHooks(this.on.afterClose, undefined);
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

    return this.adapter.sendMessage(sendMessageOptions);
  }
}
