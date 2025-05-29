import MqttIncomingQueue from "./MqttIncomingQueue.js";
import MqttOutgoingQueue from "./MqttOutgoingQueue.js";

export default class MqttQueue {
  private constructor() {}

  public static Outgoing = MqttOutgoingQueue;
  public static Incoming = MqttIncomingQueue;
}
