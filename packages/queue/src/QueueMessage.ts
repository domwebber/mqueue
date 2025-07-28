import { JsonValue } from "./utils/types.js";

export type QueueMessageHeaders = Record<string, string | undefined>;

export interface QueueMessageOptions {
  isRedelivered?: boolean;
  headers?: QueueMessageHeaders;
  body: Buffer;
}

export type QueueMessageFromJSONOptions = Omit<QueueMessageOptions, "body">;

export class QueueMessage {
  public body: Buffer;
  public headers: QueueMessageHeaders;
  public isRedelivered?: boolean;

  constructor({ body, headers, isRedelivered = false }: QueueMessageOptions) {
    this.body = body;
    this.headers = headers ?? {};
    this.isRedelivered = isRedelivered;
  }

  /** Body Content as JSON */
  public async json<T = unknown>(): Promise<T> {
    const text = await this.text();
    return JSON.parse(text);
  }

  /** Body Content as Text/String */
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
