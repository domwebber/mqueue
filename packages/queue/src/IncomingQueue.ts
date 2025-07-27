import IncomingQueueAdapter from "./Adapter/IncomingQueueAdapter.js";
import { QueueMessage } from "./QueueMessage.js";
import { Hook, HookSet, resolveHooks } from "./utils/hooks.js";

export type IncomingQueueMessageListenerInput = {
  accept: () => Promise<void>;
  reject: (error?: Error) => Promise<void>;
  transport: {
    name: string;
  };
  message: QueueMessage;
  [key: string]: unknown;
};

export type IncomingQueueMessageListener = (
  options: IncomingQueueMessageListenerInput,
) => Promise<void>;

export interface IncomingQueueOptions {
  onReceipt?: Hook<IncomingQueueMessageListenerInput>[];
  onHealthcheck?: Hook<unknown>[];
  onBeforeClose?: Hook<unknown>[];
  onAfterClose?: Hook<unknown>[];
}

export default class IncomingQueue {
  public on = {
    receipt: new HookSet<IncomingQueueMessageListenerInput>(),
    healthcheck: new HookSet(),
    beforeClose: new HookSet(),
    afterClose: new HookSet(),
  };

  constructor(
    public adapter: IncomingQueueAdapter,
    options: IncomingQueueOptions = {},
  ) {
    options.onReceipt?.map((hook) => this.on.receipt.add(hook));
    options.onHealthcheck?.map((hook) => this.on.healthcheck.add(hook));
    options.onBeforeClose?.map((hook) => this.on.beforeClose.add(hook));
    options.onAfterClose?.map((hook) => this.on.afterClose.add(hook));
  }

  /** Check that MQueue is connected under-the-hood */
  public async isConnected(): Promise<boolean> {
    return this.healthcheck()
      .then(() => true)
      .catch(() => false);
  }

  /** Assert that MQueue is connected under-the-hood */
  public async healthcheck(): Promise<void> {
    await resolveHooks(this.on.healthcheck, undefined);
    return this.adapter.healthcheck();
  }

  /** Close the queue connection */
  public async close(): Promise<void> {
    await resolveHooks(this.on.beforeClose, undefined);
    this.adapter.close();
    await resolveHooks(this.on.afterClose, undefined);
  }

  public consume(callback?: IncomingQueueMessageListener): Promise<void> {
    return this.adapter.consume(async (input) => {
      const options = {
        ...input,
        message: new QueueMessage(input.message),
      };

      const payload = await resolveHooks(this.on.receipt, options);
      await callback?.(payload);
    });
  }
}
