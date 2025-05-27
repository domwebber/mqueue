export default interface QueueAdapter {
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
