import MulticastIncomingQueue from "./MulticastIncomingQueue.js";
import MulticastOutgoingQueue from "./MulticastOutgoingQueue.js";

export default class MulticastQueue {
  private constructor() {}

  public static Outgoing = MulticastOutgoingQueue;
  public static Incoming = MulticastIncomingQueue;
}
