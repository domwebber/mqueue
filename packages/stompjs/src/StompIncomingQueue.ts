import {
  IncomingQueueAdapter,
  IncomingQueueMessageAdapterListener,
} from "@mqueue/queue";
import {
  Client,
  ActivationState,
  StompSubscription,
  StompConfig,
} from "@stomp/stompjs";
import { WebSocket } from "ws";

export type IncomingConnectOptions = Omit<StompConfig, "webSocketFactory">;

export default class StompIncomingQueue implements IncomingQueueAdapter {
  public type = "stomp";

  protected _subscription?: StompSubscription;

  constructor(
    public client: Client,
    public destination: string,
  ) {}

  public static async connect(
    url: string | URL,
    destination: string,
    options: IncomingConnectOptions = {},
  ) {
    const client = new Client({
      ...options,
      webSocketFactory: () => {
        return new WebSocket(url);
      },
    });

    const connectPromise = new Promise<void>((resolve, reject) => {
      client.onConnect = () => resolve();
      client.onStompError = (frame) => reject(new Error(frame.body));
      client.onWebSocketError = (event) =>
        reject(new Error("WebSocket error: " + event));
    });

    client.activate();
    await connectPromise;

    return new this(client, destination);
  }

  public async healthcheck(): Promise<void> {
    if (
      !this.client.connected ||
      this.client.state !== ActivationState.ACTIVE
    ) {
      throw new Error("STOMP Receiver unexpectedly disconnected");
    }
  }

  public async close() {
    const disconnectPromise = new Promise<void>((resolve) => {
      this.client.onWebSocketClose = () => resolve();
      this.client.onDisconnect = () => resolve();
    });

    this._subscription?.unsubscribe();
    await this.client.deactivate();
    await disconnectPromise;
  }

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
    this._subscription = this.client.subscribe(
      this.destination,
      async (message) => {
        await callback({
          accept: async () => {
            message.ack();
          },
          reject: async () => {
            message.nack();
          },
          transport: {
            name: this.destination,
          },
          message: {
            headers: message.headers,
            body: Buffer.from(
              message.isBinaryBody ? message.binaryBody : message.body,
            ),
          },
        });
      },
    );
  }
}
