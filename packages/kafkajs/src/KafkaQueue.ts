import KafkaIncomingQueue from "./KafkaIncomingQueue.js";
import KafkaOutgoingQueue from "./KafkaOutgoingQueue.js";

export default class KafkaQueue {
  private constructor() {}

  public static Outgoing = KafkaOutgoingQueue;
  public static Incoming = KafkaIncomingQueue;
}
