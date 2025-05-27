import AmqplibOutgoingQueue from "./AmqplibOutgoingQueue.js";

export default class AmqplibQueue {
  private constructor() {}

  public static Outgoing = AmqplibOutgoingQueue;
  public static Incoming = undefined;
}
