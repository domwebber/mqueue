import {
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
} from "@mqueue/queue";
import { Connection, ConnectionOptions, Receiver } from "rhea-promise";

export interface RheaIncomingQueueConnectOptions {
  source: {
    address: string;
  };
}

export default class RheaIncomingQueue implements IncomingQueueAdapter {
  public type = "rhea";

  public receiver?: Receiver;

  constructor(public connection: Connection) {}

  public static async connect(
    connectionOptions: ConnectionOptions,
    { source }: RheaIncomingQueueConnectOptions,
  ) {
    const connection = new Connection({
      reconnect: true,
      port: 5672,
      ...connectionOptions,
      receiver_options: {
        source,
      },
    });

    await connection.open();
    return new this(connection);
  }

  public async healthcheck() {
    if (!this.receiver?.isOpen()) {
      throw new Error("AMQPv1.0 Receiver unexpectedly disconnected");
    }
  }

  public async close() {
    await this.receiver?.close();
    await this.receiver?.connection.close();
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    this.receiver = await this.connection.createReceiver({
      autoaccept: false,
      credit_window: 500,
      onMessage: (context) => {
        const message = context.message;
        if (message === undefined) {
          // this._logger.warn(
          //   "Message event handler received non-message event. Check receiver.on() subscriptions.",
          //   context,
          // );
          return;
        }

        const delivery = context.delivery;
        if (delivery === undefined) {
          // this._logger.error(
          //   "Message received without delivery, thus the message has no acceptance mechanism",
          //   context,
          // );
          return;
        }

        const body = Buffer.from(
          message.body,
          // AMQP10IncomingQueue.BODY_ENCODING,
        );

        callback({
          // raw: message,
          accept: async () => {
            delivery.accept();
          },
          reject: async () => {
            delivery.reject();
          },
          message: {
            isRedelivered: (message.delivery_count ?? 0) > 0,
            headers: message.application_properties ?? {},
            body,
          },
        });
      },
      onSessionError: (context) => {
        const sessionError = context.session && context.session.error;
        if (sessionError) console.error(sessionError);
      },
      onError: (context) => {
        // TODO: Add error handling here
        console.error(context);
      },
    });

    console.info("Starting Queue Consumption...");
  }
}
