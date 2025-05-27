import RheaIncomingQueue from "./RheaIncomingQueue.js";
import RheaOutgoingQueue from "./RheaOutgoingQueue.js";

export default class RheaQueue {
  private constructor() {}

  public static Outgoing = RheaOutgoingQueue;
  public static Incoming = RheaIncomingQueue;
}
