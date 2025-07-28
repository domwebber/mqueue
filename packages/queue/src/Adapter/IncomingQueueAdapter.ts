import QueueAdapter from "./QueueAdapter.js";
import { QueueMessageOptions } from "../QueueMessage.js";

export type IncomingQueueMessageAdapterListenerInput = {
  /** Ack the received Queue Message */
  accept: () => Promise<void>;

  /** Nack/Reject the received Queue Message */
  reject: (error?: Error) => Promise<void>;

  transport: {
    /** Queue/Topic Name this payload was received on */
    name: string;
  };

  message: QueueMessageOptions;

  /** Additional non-standard fields */
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
