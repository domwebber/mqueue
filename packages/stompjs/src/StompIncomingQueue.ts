import {
  Headers,
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
} from "@mqueue/queue";
import { Client, ActivationState, StompSubscription } from "@stomp/stompjs";
import { WebSocket } from "ws";

export default class StompIncomingQueue implements IncomingQueueAdapter {
  public type = "stomp";

  protected _subscription?: StompSubscription;

  constructor(
    public client: Client,
    public destination: string,
  ) {}

  public static async connect(url: string | URL, destination: string) {
    const client = new Client({
      webSocketFactory: () => {
        return new WebSocket(url);
      },
    });

    client.activate();

    return new this(client, destination);
  }

  public async healthcheck(): Promise<void> {
    if (
      !this.client.connected ||
      this.client.state !== ActivationState.ACTIVE
    ) {
      throw new Error("MQTT Receiver unexpectedly disconnected");
    }
  }

  public async close() {
    this._subscription?.unsubscribe();
    await this.client.deactivate();
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    this._subscription = this.client.subscribe(
      this.destination,
      async (message) => {
        const headers: Headers = {};
        for (const [key, value] of Object.entries(message.headers)) {
          if (!value.includes(";")) {
            headers[key] = value;
            continue;
          }

          headers[key] = value.split(";");
        }

        await callback({
          accept: async () => {
            message.ack();
          },
          reject: async () => {
            message.nack();
          },
          message: {
            headers,
            body: message.isBinaryBody
              ? Buffer.from(message.binaryBody)
              : Buffer.from(message.body),
          },
        });
      },
    );
  }
}
