import IncomingQueueAdapter, {
  IncomingQueueMessageListener,
  IncomingQueueMessageListenerInput,
} from "./Adapter/IncomingQueueAdapter.js";
import { HookSet, resolveHooks } from "./utils/hooks.js";

export default class IncomingQueue {
  public on = {
    receipt: new HookSet<IncomingQueueMessageListenerInput>(),
    close: new HookSet(),
  };

  constructor(protected _adapter: IncomingQueueAdapter) {}

  public async isConnected(): Promise<boolean> {
    return this.healthcheck()
      .then(() => true)
      .catch(() => false);
  }

  public async healthcheck(): Promise<void> {
    return this._adapter.healthcheck();
  }

  public async close(): Promise<void> {
    await resolveHooks(this.on.close, undefined);
    return this._adapter.healthcheck();
  }

  public consume(callback?: IncomingQueueMessageListener): Promise<void> {
    return this._adapter.consume(async (input) => {
      const payload = await resolveHooks(this.on.receipt, input);
      await callback?.(payload);
    });
  }
}
