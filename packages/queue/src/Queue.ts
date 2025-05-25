export default interface Queue {
  type: string;

  /**
   * Healthcheck the connection.
   *
   * @since 1.0.0
   */
  healthcheck(): Promise<void>;

  /**
   * Shutdown the connection.
   *
   * @since 1.0.0
   */
  shutdown(): Promise<void>;
}
