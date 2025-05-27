import AzureServiceBusOutgoingQueue from "./AzureServiceBusOutgoingQueue.js";

export default class AzureServiceBusQueue {
  private constructor() {}

  public static Outgoing = AzureServiceBusOutgoingQueue;
  public static Incoming = undefined;
}
