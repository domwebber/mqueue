import IncomingQueueAdapter, {
  IncomingQueueMessageListener,
  IncomingQueueMessageListenerInput,
} from "./Adapter/IncomingQueueAdapter.js";
import { Hook, HookSet, resolveHooks } from "./utils/hooks.js";

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

  public consume(callback?: IncomingQueueMessageListener): Promise<void> {
    return this.adapter.consume(async (input) => {
      const payload = await resolveHooks(this.on.receipt, input);
      await callback?.(payload);
    });
  }
}
