import {
  QueueMessageHeaders,
  IncomingQueueMessageAdapterListener,
  IncomingQueueAdapter,
} from "@mqueue/queue";
import { Consumer, ConsumerConfig, Kafka, KafkaConfig } from "kafkajs";

export interface KafkaIncomingQueueOptions {
  topic: string;
  clientOptions: KafkaConfig;
  consumerOptions: ConsumerConfig;
}

export default class KafkaIncomingQueue implements IncomingQueueAdapter {
  public type = "kafka";

  constructor(
    public client: Consumer,
    public topic: string,
  ) {}

  public static async connect({
    topic,
    clientOptions,
    consumerOptions,
  }: KafkaIncomingQueueOptions) {
    const kafka = new Kafka(clientOptions);
    const consumer = kafka.consumer(consumerOptions);
    await consumer.connect();
    return new this(consumer, topic);
  }

  public async healthcheck(): Promise<void> {}

  public async close(): Promise<void> {
    await this.client.disconnect();
  }

  public async consume(
    callback: IncomingQueueMessageAdapterListener,
  ): Promise<void> {
    await this.client.subscribe({
      topics: [this.topic],
      fromBeginning: true,
    });

    await this.client.run({
      autoCommit: false,
      eachMessage: async ({ /* topic, partition, */ message }) => {
        if (!message.value) {
          throw new Error("Received message with no body");
        }

        const headers: QueueMessageHeaders = {};
        for (const [key, value] of Object.entries(message.headers ?? {})) {
          if (value === undefined) continue;
          headers[key] = value.toString();
        }

        await callback({
          raw: message,
          accept: async () => {},
          reject: async () => {},
          transport: {
            name: this.topic,
          },
          message: {
            body: message.value,
            headers,
            isRedelivered: false,
          },
        });
      },
    });
  }
}
