import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { MessageAttributeValue } from "@aws-sdk/client-sqs";
import * as AWS from "@aws-sdk/client-sqs";

export interface SQSOutgoingQueueConnectOptions {
  sdk?: typeof AWS;
  clientConfig?: AWS.SQSClientConfig;
}

export default class SQSOutgoingQueue implements OutgoingQueueAdapter {
  public type = "sqs";

  constructor(
    public client: AWS.SQS,
    protected _queueURL: string,
  ) {}

  public static async connect(
    url: string,
    { clientConfig, sdk = AWS }: SQSOutgoingQueueConnectOptions = {},
  ) {
    const connection = new sdk.SQS({
      ...clientConfig,
    });

    return new this(connection, url);
  }

  public async healthcheck() {
    await this.client.getQueueAttributes({
      QueueUrl: this._queueURL,
    });
  }

  public async close() {}

  public async sendMessage(message: QueueMessage): Promise<void> {
    const messageAttributes: Record<string, MessageAttributeValue> = {};
    for (const [key, value] of Object.entries(message.headers)) {
      if (Array.isArray(value)) {
        messageAttributes[key] = {
          DataType: "StringList", // TODO: Check this
          StringListValues: value,
        };
        continue;
      }

      messageAttributes[key] = {
        DataType: "String",
        StringValue: value,
      };
    }

    await this.client.sendMessage({
      QueueUrl: this._queueURL,
      MessageBody: message.body.toString(),
      MessageAttributes: messageAttributes,
    });
  }
}
