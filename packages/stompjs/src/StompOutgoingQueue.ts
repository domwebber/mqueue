import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import {
  Client,
  ActivationState,
  StompHeaders,
  StompConfig,
} from "@stomp/stompjs";

export type OutgoingConnectOptions = Omit<StompConfig, "webSocketFactory">;

export default class StompOutgoingQueue implements OutgoingQueueAdapter {
  public type = "stomp";

  constructor(
    public client: Client,
    public destination: string,
  ) {}

  public static async connect(
    url: string | URL,
    destination: string,
    options: OutgoingConnectOptions = {},
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
      throw new Error("STOMP Sender unexpectedly disconnected");
    }
  }

  public async close() {
    const disconnectPromise = new Promise<void>((resolve) => {
      this.client.onWebSocketClose = () => resolve();
      this.client.onDisconnect = () => resolve();
    });

    await this.client.deactivate();
    await disconnectPromise;
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    const headers: StompHeaders = {};
    for (const [key, value] of Object.entries(message.headers ?? {})) {
      if (value === undefined) continue;
      headers[key] = Array.isArray(value) ? value.join(";") : value;
    }

    this.client.publish({
      destination: this.destination,
      headers,
      binaryBody: message.body,
    });
  }
}
