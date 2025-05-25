export type Headers = Record<string, string | string[] | undefined>;

export default interface QueueMessage {
  /**
   * Is Redelivered.
   *
   * @since 1.0.0
   */
  isRedelivered?: boolean;

  /**
   * Message Headers.
   *
   * @since 1.0.0
   */
  headers: Headers;

  /**
   * Body Content.
   *
   * @since 1.0.0
   */
  body: Buffer;
}
