import OutgoingQueueAdapter from "./Adapter/OutgoingQueueAdapter.js";
import QueueMessage from "./QueueMessage.js";
import { Hook, HookSet, resolveHooks } from "./utils/hooks.js";
import { JsonValue } from "./utils/types.js";

export interface OutgoingQueueOptions {
  onSend?: Hook<QueueMessage>[];
  onHealthcheck?: Hook<unknown>[];
  onBeforeClose?: Hook<unknown>[];
  onAfterClose?: Hook<unknown>[];
}

export type SendMessageOptions = Omit<QueueMessage, "body"> &
  (
    | {
        body: Buffer | string;
      }
    | {
        json: JsonValue;
      }
  );

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
    let body: Buffer;
    if ("body" in message) {
      body = Buffer.isBuffer(message.body)
        ? message.body
        : Buffer.from(message.body);
    } else if ("json" in message) {
      body = Buffer.from(JSON.stringify(message.json));
    } else {
      throw new Error("sendMessage options must specify either body or json");
    }

    const sendMessageOptions = await resolveHooks(this.on.send, {
      ...message,
      body,
    });

    return this.adapter.sendMessage(sendMessageOptions);
  }
}
