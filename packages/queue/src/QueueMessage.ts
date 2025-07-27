import { JsonValue } from "./utils/types.js";

export type QueueMessageHeaders = Record<string, string | string[] | undefined>;

export interface QueueMessageOptions {
  isRedelivered?: boolean;
  headers?: QueueMessageHeaders;
  body: Buffer;
}

export type QueueMessageFromJSONOptions = Omit<QueueMessageOptions, "body">;

export interface QueueMessageType {
  /** Whether the message was redelivered */
  isRedelivered?: boolean;

  /** Message Headers */
  headers: QueueMessageHeaders;

  /** Body Content */
  body: Buffer;

  /** Body Content as JSON */
  json<T = unknown>(): Promise<T>;

  /** Body Content as Text/String */
  text(): Promise<string>;
}

export class QueueMessage implements QueueMessageType {
  public body: Buffer;
  public headers: QueueMessageHeaders;
  public isRedelivered?: boolean;

  constructor({ body, headers, isRedelivered = false }: QueueMessageOptions) {
    this.body = body;
    this.headers = headers ?? {};
    this.isRedelivered = isRedelivered;
  }

  public async json<T = unknown>(): Promise<T> {
    const text = await this.text();
    return JSON.parse(text);
  }

  public async text(): Promise<string> {
    return this.body.toString("utf8");
  }

  public static fromJSON(
    json: JsonValue,
    options: QueueMessageFromJSONOptions,
  ) {
    return new this({
      ...options,
      body: Buffer.from(JSON.stringify(json)),
    });
  }
}
