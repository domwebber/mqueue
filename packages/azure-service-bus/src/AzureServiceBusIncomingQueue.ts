import {
  IncomingQueueAdapter,
  QueueMessageHeaders,
  IncomingQueueMessageAdapterListener,
} from "@mqueue/queue";
import {
  ServiceBusClient,
  ServiceBusClientOptions,
  type ServiceBusReceiver,
} from "@azure/service-bus";

export default class AzureServiceBusIncomingQueue
  implements IncomingQueueAdapter
{
  public type = "azure-service-bus";

  constructor(
    public connection: ServiceBusClient,
    public channel: ServiceBusReceiver,
    public queueName: string,
  ) {}

  public static async connect(
    connectionString: string,
    queueName: string,
    options?: ServiceBusClientOptions,
  ) {
    const connection = new ServiceBusClient(connectionString, options);
    const connectionChannel = await connection.createReceiver(queueName, {
      skipParsingBodyAsJson: true,
    });
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

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
    this.channel.subscribe(
      {
        processMessage: async (message) => {
          if (!message.body) {
            throw new Error("Received message with no body");
          }

          if (!message.messageId) {
            throw new Error("Received message with no message ID");
          }

          if (!message.applicationProperties) {
            throw new Error("Received message with no headers");
          }

          const headers: QueueMessageHeaders = {};
          for (const [key, value] of Object.entries(
            message.applicationProperties,
          )) {
            if (value === null) continue;
            headers[key] = value.toString();
          }

          await callback({
            raw: message,
            accept: async () => {
              await this.channel.completeMessage(message);
            },
            reject: async (error) => {
              await this.channel.deadLetterMessage(
                message,
                error
                  ? {
                      deadLetterReason: error.name,
                      deadLetterErrorDescription: error.message,
                    }
                  : undefined,
              );
            },
            transport: {
              name: this.queueName,
            },
            message: {
              isRedelivered: (message.deliveryCount ?? 0) > 0,
              headers,
              body: Buffer.from(message.body, "binary"),
            },
          });
        },
        processError: async (error) => {
          console.error(error);
        },
      },
      {
        autoCompleteMessages: false,
      },
    );
  }
}
