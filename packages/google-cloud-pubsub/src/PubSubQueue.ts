import PubSubIncomingQueue from "./PubSubIncomingQueue.js";
import PubSubOutgoingQueue from "./PubSubOutgoingQueue.js";

export default class PubSubQueue {
  private constructor() {}

  public static Outgoing = PubSubOutgoingQueue;
  public static Incoming = PubSubIncomingQueue;
}
