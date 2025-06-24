import IncomingQueueAdapter, {
  IncomingQueueMessageListener,
  IncomingQueueMessageListenerInput,
} from "./Adapter/IncomingQueueAdapter.js";
import { HookSet, resolveHooks } from "./utils/hooks.js";

export default class IncomingQueue {
  public on = {
    receipt: new HookSet<IncomingQueueMessageListenerInput>(),
  };

  constructor(protected _adapter: IncomingQueueAdapter) {}

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

  public consume(callback?: IncomingQueueMessageListener): Promise<void> {
    return this._adapter.consume(async (input) => {
      const payload = await resolveHooks(input, this.on.receipt);
      await callback?.(payload);
    });
  }
}
