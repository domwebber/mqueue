import {
  IncomingQueueAdapter,
  IncomingQueueMessageAdapterListener,
} from "@mqueue/queue";
import { PubSub, Topic, Subscription, Message } from "@google-cloud/pubsub";

export default class PubSubIncomingQueue implements IncomingQueueAdapter {
  public type = "pubsub";

  public subscription?: Subscription;
  protected _callback?: IncomingQueueMessageAdapterListener;

  constructor(
    public client: PubSub,
    public topic: Topic,
    public subscriptionName: string,
  ) {}

  public static async connect(topicName: string, subscriptionName: string) {
    const client = new PubSub();
    const topic = client.topic(topicName);
    return new this(client, topic, subscriptionName);
  }

  public async healthcheck(): Promise<void> {
    const [detached] = (await this.subscription?.detached()) ?? [true];
    if (!this.client.isOpen || detached) {
      throw new Error("Pub/Sub Receiver unexpectedly disconnected");
    }
  }

  public async close(): Promise<void> {
    this.subscription?.removeListener("message", this._handleMessage);
    await this.subscription?.close();
    await this.client.detachSubscription(this.subscriptionName);
    await this.client.close();
  }

  protected async _handleMessage(message: Message): Promise<void> {
    await this._callback?.({
      accept: async () => {
        message.ack();
      },
      reject: async () => {
        message.nack();
      },
      transport: {
        name: this.topic.name,
      },
      message: {
        isRedelivered: message.deliveryAttempt > 1,
        body: message.data,
        headers: message.attributes,
      },
    });
  }

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
    this._callback = callback;
    this.subscription = this.topic.subscription(this.subscriptionName);
    this.subscription.on("message", this._handleMessage);
  }
}
