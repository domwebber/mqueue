import SQSIncomingQueue from "./SQSIncomingQueue.js";
import SQSOutgoingQueue from "./SQSOutgoingQueue.js";

export default class SQSQueue {
  private constructor() {}

  public static Outgoing = SQSOutgoingQueue;
  public static Incoming = SQSIncomingQueue;
}
