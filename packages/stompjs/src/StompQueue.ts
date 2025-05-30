import StompIncomingQueue from "./StompIncomingQueue.js";
import StompOutgoingQueue from "./StompOutgoingQueue.js";

export default class StompQueue {
  private constructor() {}

  public static Outgoing = StompOutgoingQueue;
  public static Incoming = StompIncomingQueue;
}
