import NullIncomingQueue from "./NullIncomingQueue.js";
import NullOutgoingQueue from "./NullOutgoingQueue.js";

export default class NullQueue {
  private constructor() {}

  public static Outgoing = NullOutgoingQueue;
  public static Incoming = NullIncomingQueue;
}
