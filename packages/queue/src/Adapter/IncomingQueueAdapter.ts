import QueueAdapter from "./QueueAdapter.js";
import QueueMessage from "../QueueMessage.js";

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

export default interface IncomingQueueAdapter extends QueueAdapter {
  /**
   * Listen for messages.
   *
   * @since 1.0.0
   */
  consume(callback: IncomingQueueMessageListener): Promise<void>;
}
