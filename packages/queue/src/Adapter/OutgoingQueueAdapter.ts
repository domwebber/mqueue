import QueueAdapter from "./QueueAdapter.js";
import { QueueMessageOptions } from "../QueueMessage.js";

export default interface OutgoingQueueAdapter extends QueueAdapter {
  /**
   * Create a message.
   *
   * @since 1.0.0
   */
  sendMessage(message: QueueMessageOptions): Promise<void>;
}
