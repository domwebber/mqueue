export type Headers = Record<string, string | string[] | undefined>;

export default interface QueueMessage {
  /** Whether the message was redelivered */
  isRedelivered?: boolean;

  /** Message Headers */
  headers: Headers;

  /** Body Content */
  body: Buffer;
}
