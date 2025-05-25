import Queue from "./Queue.js";
import QueueMessage from "./QueueMessage.js";

export default interface OutgoingQueueInterface extends Queue {
  /**
   * Create a message.
   *
   * @since 1.0.0
   */
  sendMessage(message: QueueMessage): Promise<void>;
}
