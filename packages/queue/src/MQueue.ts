import IncomingQueue from "./IncomingQueue.js";
import OutgoingQueue from "./OutgoingQueue.js";

/**
 * MQueue - A simple queue interface with support for multiple backends.
 * @see https://github.com/domwebber/mqueue
 */
export default class MQueue {
  private constructor() {}

  /** Initialise an Outgoing Queue to send messages */
  public static Outgoing = OutgoingQueue;

  /** Initialise an Incoming Queue to receive messages */
  public static Incoming = IncomingQueue;
}
