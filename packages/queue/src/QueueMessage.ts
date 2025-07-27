import { JsonValue } from "./utils/types.js";

export type QueueMessageHeaders = Record<string, string | string[] | undefined>;

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
  constructor(
    public body: Buffer,
    public headers: QueueMessageHeaders,
    public isRedelivered = false,
  ) {}

  public async json<T = unknown>(): Promise<T> {
    const text = await this.text();
    return JSON.parse(text);
  }

  public async text(): Promise<string> {
    return this.body.toString("utf8");
  }

  public static fromJSON(
    json: JsonValue,
    headers: QueueMessageHeaders,
    isRedelivered = false,
  ) {
    return new this(Buffer.from(JSON.stringify(json)), headers, isRedelivered);
  }
}
