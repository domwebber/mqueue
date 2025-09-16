import * as AWS from "@aws-sdk/client-sqs";
import {
  IncomingQueueAdapter,
  IncomingQueueMessageAdapterListener,
  QueueMessageHeaders,
} from "@mqueue/queue";
import { Consumer } from "sqs-consumer";

export interface SQSIncomingQueueConnectOptions {
  sdk?: typeof AWS;
  clientConfig?: AWS.SQSClientConfig;
}

export default class SQSIncomingQueue implements IncomingQueueAdapter {
  public type = "sqs";

  protected _consumer: Consumer;
  protected _callback?: IncomingQueueMessageAdapterListener;

  constructor(
    public client: AWS.SQS,
    protected _queueURL: string,
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
    { clientConfig, sdk = AWS }: SQSIncomingQueueConnectOptions = {},
  ) {
    const connection = new sdk.SQS({
      ...clientConfig,
    });

    return new this(connection, url);
  }

  public async healthcheck() {
    if (!this._consumer.status.isRunning) {
      throw new Error("AWS SQS Receiver unexpectedly disconnected");
    }
  }

  public async close() {
    this._consumer.stop();
    this.client.destroy();
  }

  protected async _handleMessage(
    message: AWS.Message,
  ): Promise<AWS.Message | void> {
    const body = message.Body;
    if (!body) {
      throw new Error("Received message with no body");
    }

    const headers: QueueMessageHeaders = {};
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
        headers[key] = value.StringListValues.join(";");
        continue;
      }

      if (value.BinaryListValues) {
        headers[key] = value.BinaryListValues.map((buffer) =>
          buffer.toString(),
        ).join(";");
        continue;
      }
    }

    let isAccepted = false;
    await this._callback?.({
      // raw: message,
      accept: async () => {
        isAccepted = true;
      },
      reject: async () => {},
      transport: {
        name: this._queueURL,
      },
      message: {
        headers,
        body: Buffer.from(body),
      },
    });

    if (isAccepted) {
      await this.client.deleteMessage({
        QueueUrl: this._queueURL,
        ReceiptHandle: message.ReceiptHandle,
      });

      return message;
    }

    // Void treated as rejection
  }

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
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
