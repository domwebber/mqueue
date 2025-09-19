import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { MessageAttributeValue } from "@aws-sdk/client-sqs";
import * as AWS from "@aws-sdk/client-sqs";

export type SQSOutgoingQueueBeforeSendHook = (
  request: AWS.SendMessageRequest,
) => Promise<AWS.SendMessageRequest> | AWS.SendMessageRequest;

export interface SQSOutgoingQueueConnectOptions {
  sdk?: typeof AWS;
  clientConfig?: AWS.SQSClientConfig;
  beforeSend?: SQSOutgoingQueueBeforeSendHook;
}

export default class SQSOutgoingQueue implements OutgoingQueueAdapter {
  public type = "sqs";

  protected _beforeSend?: SQSOutgoingQueueBeforeSendHook;

  constructor(
    public client: AWS.SQS,
    protected _queueURL: string,
    { beforeSend }: { beforeSend?: SQSOutgoingQueueBeforeSendHook } = {},
  ) {
    this._beforeSend = beforeSend;
  }

  public static async connect(
    url: string,
    {
      clientConfig,
      sdk = AWS,
      beforeSend,
    }: SQSOutgoingQueueConnectOptions = {},
  ) {
    const connection = new sdk.SQS({
      ...clientConfig,
    });

    return new this(connection, url, { beforeSend });
  }

  public async healthcheck() {
    await this.client.getQueueAttributes({
      QueueUrl: this._queueURL,
    });
  }

  public async close() {
    this.client.destroy();
  }

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

    let options: AWS.SendMessageRequest = {
      QueueUrl: this._queueURL,
      MessageBody: message.body.toString(),
      MessageAttributes: messageAttributes,
    };

    if (this._beforeSend) {
      options = await this._beforeSend(options);
    }

    await this.client.sendMessage(options);
  }
}
