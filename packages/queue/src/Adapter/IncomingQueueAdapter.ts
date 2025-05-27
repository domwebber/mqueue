import QueueAdapter from "./QueueAdapter.js";
import QueueMessage from "../QueueMessage.js";

export type IncomingQueueMessageListener = (options: {
  accept: () => Promise<void>;
  reject: (error?: Error) => Promise<void>;
  message: QueueMessage;
  [key: string]: unknown;
}) => Promise<void>;

export default interface IncomingQueueAdapter extends QueueAdapter {
  /**
   * Listen for messages.
   *
   * @since 1.0.0
   */
  consume(callback: IncomingQueueMessageListener): Promise<void>;
}
