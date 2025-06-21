import {
  Headers,
  IncomingQueueMessageListener,
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
    protected _client: Consumer,
    protected _topic: string,
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
    await this._client.disconnect();
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    await this._client.subscribe({
      topics: [this._topic],
      fromBeginning: true,
    });

    await this._client.run({
      autoCommit: false,
      eachMessage: async ({ /* topic, partition, */ message }) => {
        if (!message.value) {
          throw new Error("Received message with no body");
        }

        const headers: Headers = {};
        for (const [key, value] of Object.entries(message.headers ?? {})) {
          if (value === undefined) continue;
          headers[key] = value.toString();
        }

        await callback({
          raw: message,
          accept: async () => {},
          reject: async () => {},
          message: {
            isRedelivered: false,
            headers,
            body: message.value,
          },
        });
      },
    });
  }
}
