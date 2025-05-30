import FastqIncomingQueue from "./FastqIncomingQueue.js";
import FastqOutgoingQueue from "./FastqOutgoingQueue.js";

export default class FastqQueue {
  private constructor() {}

  public static Outgoing = FastqOutgoingQueue;
  public static Incoming = FastqIncomingQueue;
}
