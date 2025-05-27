import IncomingQueue from "./IncomingQueue.js";
import OutgoingQueue from "./OutgoingQueue.js";

export default class MQueue {
  private constructor() {}

  public static outgoing = OutgoingQueue;
  public static incoming = IncomingQueue;
}
