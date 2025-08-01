import {
  IncomingQueueAdapter,
  IncomingQueueMessageAdapterListener,
  QueueMessageHeaders,
} from "@mqueue/queue";
import { connectAsync, MqttClient, OnMessageCallback } from "mqtt";

export default class MqttIncomingQueue implements IncomingQueueAdapter {
  public type = "mqtt";
  protected _consumer?: OnMessageCallback;

  constructor(
    public client: MqttClient,
    public topics: string | string[],
  ) {}

  public static async connect(
    topics: string | string[],
    ...options: Parameters<typeof connectAsync>
  ) {
    const client = await connectAsync(...options);
    return new this(client, topics);
  }

  public async healthcheck(): Promise<void> {
    this.client.sendPing();

    if (
      (!this.client.connected && !this.client.reconnecting) ||
      this.client.disconnecting
    ) {
      throw new Error("MQTT Sender unexpectedly disconnected");
    }
  }

  public async close() {
    await this.client.unsubscribeAsync(this.topics);
    if (this._consumer) {
      this.client.removeListener("message", this._consumer);
    }

    await this.client.endAsync();
  }

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
    this._consumer = async (topic, payload, packet) => {
      const headers: QueueMessageHeaders = {};
      for (const [key, value] of Object.entries(
        packet.properties?.userProperties ?? {},
      )) {
        if (!Array.isArray(value)) {
          headers[key] = value;
          continue;
        }

        headers[key] = value.join(";");
      }

      await callback({
        accept: async () => {},
        reject: async () => {},
        transport: {
          name: topic,
        },
        message: {
          headers,
          body: payload,
        },
      });
    };

    this.client.on("message", this._consumer);
    this.client.subscribeAsync(this.topics, {});
  }
}
