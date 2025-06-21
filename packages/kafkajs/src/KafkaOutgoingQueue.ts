import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { Kafka, KafkaConfig, Producer, ProducerConfig } from "kafkajs";

export interface KafkaOutgoingQueueOptions {
  topic: string;
  clientOptions: KafkaConfig;
  producerOptions?: ProducerConfig;
}

export default class KafkaOutgoingQueue implements OutgoingQueueAdapter {
  public type = "kafka";

  constructor(
    protected _client: Producer,
    protected _topic: string,
  ) {}

  public static async connect({
    topic,
    clientOptions,
    producerOptions,
  }: KafkaOutgoingQueueOptions) {
    const kafka = new Kafka(clientOptions);
    const producer = kafka.producer(producerOptions);
    await producer.connect();
    return new this(producer, topic);
  }

  public async healthcheck(): Promise<void> {}

  public async close(): Promise<void> {
    await this._client.disconnect();
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    await this._client.send({
      topic: this._topic,
      messages: [
        {
          value: message.body,
          headers: message.headers,
        },
      ],
    });
  }
}
