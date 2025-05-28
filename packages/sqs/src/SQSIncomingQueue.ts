import * as AWS from "@aws-sdk/client-sqs";
import {
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
  Headers,
} from "@mqueue/queue";
import { Consumer } from "sqs-consumer";

export interface SQSIncomingQueueConnectOptions {
  sdk?: typeof AWS;
  clientConfig: AWS.SQSClientConfig;
}

export default class SQSIncomingQueue implements IncomingQueueAdapter {
  public type = "sqs";

  protected _consumer: Consumer;
  protected _callback?: IncomingQueueMessageListener;

  constructor(
    public client: AWS.SQS,
    protected _queueURL: string,
    public queueName: string,
  ) {
    this._consumer = Consumer.create({
      extendedAWSErrors: true,
      queueUrl: this._queueURL,
      sqs: this.client,
      attributeNames: ["All"],
      messageAttributeNames: ["All"],
      batchSize: 10,
      // waitTimeSeconds: 20,
      handleMessage: async (message) => this._handleMessage(message),
    });
  }

  public static async connect(
    url: string,
    queueName: string,
    { clientConfig, sdk = AWS }: SQSIncomingQueueConnectOptions,
  ) {
    const connection = new sdk.SQS({
      ...clientConfig,
    });

    return new this(connection, url, queueName);
  }

  public async healthcheck() {
    if (!this._consumer.status.isRunning) {
      throw new Error("AWS SQS Receiver unexpectedly disconnected");
    }
  }

  public async close() {
    this._consumer.stop();
  }

  protected async _handleMessage(
    message: AWS.Message,
  ): Promise<AWS.Message | void> {
    if (!message.Body) {
      throw new Error("Received message with no body");
    }

    const headers: Headers = {};
    for (const [key, value] of Object.entries(
      message.MessageAttributes ?? {},
    )) {
      if (value.StringValue) {
        headers[key] = value.StringValue;
        continue;
      }

      if (value.BinaryValue) {
        headers[key] = value.BinaryValue.toString();
        continue;
      }

      if (value.StringListValues) {
        headers[key] = value.StringListValues;
        continue;
      }

      if (value.BinaryListValues) {
        headers[key] = value.BinaryListValues.map((buffer) =>
          buffer.toString(),
        );
        continue;
      }
    }

    await this._callback?.({
      // raw: message,
      accept: async () => {
        await this.client.deleteMessage({
          QueueUrl: this._queueURL,
          ReceiptHandle: message.ReceiptHandle,
        });
      },
      reject: async () => {},
      message: {
        headers,
        body: Buffer.from(message.Body),
      },
    });
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    this._callback = callback;

    this._consumer.on("error", (error) => {
      console.error("Queue error:", error);
    });

    this._consumer.on("processing_error", (error) => {
      console.error("Processing error:", error);
    });

    this._consumer.start();
  }
}
