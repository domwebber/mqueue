import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { Client, ActivationState, StompHeaders } from "@stomp/stompjs";
import { WebSocket } from "ws";

export default class StompOutgoingQueue implements OutgoingQueueAdapter {
  public type = "stomp";

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
      throw new Error("STOMP Sender unexpectedly disconnected");
    }
  }

  public async close() {
    await this.client.deactivate();
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
