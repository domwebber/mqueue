import QueueAdapter from "./QueueAdapter.js";
import { QueueMessageOptions } from "../QueueMessage.js";

export type IncomingQueueMessageAdapterListenerInput = {
  accept: () => Promise<void>;
  reject: (error?: Error) => Promise<void>;
  transport: {
    name: string;
  };
  message: QueueMessageOptions;
  [key: string]: unknown;
};

export type IncomingQueueMessageAdapterListener = (
  options: IncomingQueueMessageAdapterListenerInput,
) => Promise<void>;

export default interface IncomingQueueAdapter extends QueueAdapter {
  /**
   * Listen for messages.
   *
   * @since 1.0.0
   */
  consume(callback: IncomingQueueMessageAdapterListener): Promise<void>;
}
