import {
  IncomingQueueAdapter,
  Headers,
  IncomingQueueMessageListener,
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
    protected _connection: ServiceBusClient,
    protected _channel: ServiceBusReceiver,
    protected _queueName: string,
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
    if (this._channel.isClosed) {
      throw new Error(
        "Azure Service Bus Sender unexpectedly closed connection",
      );
    }
  }

  public async close(): Promise<void> {
    return await this._connection.close();
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    this._channel.subscribe(
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

          const headers: Headers = {};
          for (const [key, value] of Object.entries(
            message.applicationProperties,
          )) {
            if (value === null) continue;
            headers[key] = value.toString();
          }

          await callback({
            raw: message,
            accept: async () => {
              await this._channel.completeMessage(message);
            },
            reject: async (error) => {
              await this._channel.deadLetterMessage(
                message,
                error
                  ? {
                      deadLetterReason: error.name,
                      deadLetterErrorDescription: error.message,
                    }
                  : undefined,
              );
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
