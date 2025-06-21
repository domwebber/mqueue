import {
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
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

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    this._consumer = async (topic, payload, packet) => {
      console.log({ topic, payload, packet });

      await callback({
        accept: async () => {},
        reject: async () => {},
        transport: {
          name: topic,
        },
        message: {
          headers: packet.properties?.userProperties ?? {},
          body: payload,
        },
      });
    };

    this.client.on("message", this._consumer);
    this.client.subscribeAsync(this.topics, {});
  }
}
