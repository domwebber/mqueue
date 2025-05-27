import IncomingQueue from "./IncomingQueue.js";
import OutgoingQueue from "./OutgoingQueue.js";

export default class MQueue {
  private constructor() {}

  public static Outgoing = OutgoingQueue;
  public static Incoming = IncomingQueue;
}
