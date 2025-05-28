import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import {
  ServiceBusClient,
  ServiceBusClientOptions,
  type ServiceBusSender,
} from "@azure/service-bus";

export interface AzureServiceBusOutgoingQueueConnectOptions {
  clientOptions?: ServiceBusClientOptions;
}

export default class AzureServiceBusOutgoingQueue
  implements OutgoingQueueAdapter
{
  public type = "azure-service-bus";

  constructor(
    public connection: ServiceBusClient,
    public channel: ServiceBusSender,
    public queueName: string,
  ) {}

  public static async connect(
    connectionString: string,
    queueName: string,
    { clientOptions }: AzureServiceBusOutgoingQueueConnectOptions = {},
  ) {
    const connection = new ServiceBusClient(connectionString, clientOptions);
    const connectionChannel = connection.createSender(queueName);
    return new this(connection, connectionChannel, queueName);
  }

  public async healthcheck(): Promise<void> {
    if (this.channel.isClosed) {
      throw new Error(
        "Azure Service Bus Sender unexpectedly closed connection",
      );
    }
  }

  public async close(): Promise<void> {
    return await this.connection.close();
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    await this.channel.sendMessages({
      // contentType: "application/json",
      applicationProperties: message.headers,
      body: message.body,
    });
  }
}
