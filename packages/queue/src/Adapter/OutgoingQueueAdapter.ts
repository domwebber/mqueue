import QueueAdapter from "./QueueAdapter.js";
import QueueMessage from "../QueueMessage.js";

export default interface OutgoingQueueAdapter extends QueueAdapter {
  /**
   * Create a message.
   *
   * @since 1.0.0
   */
  sendMessage(message: QueueMessage): Promise<void>;
}
