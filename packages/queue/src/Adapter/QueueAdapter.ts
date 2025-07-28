export default interface QueueAdapter {
  /** Queue provider/type identifier */
  type: string;

  /**
   * Healthcheck the connection.
   *
   * @since 1.0.0
   */
  healthcheck(): Promise<void>;

  /**
   * Close the connection.
   *
   * @since 1.0.0
   */
  close(): Promise<void>;
}
