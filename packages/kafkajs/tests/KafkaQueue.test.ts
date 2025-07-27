import assert from "node:assert";
import test, { describe, mock } from "node:test";
import { KafkaContainer, StartedKafkaContainer } from "@testcontainers/kafka";
import KafkaQueue from "../src/KafkaQueue.js";
import KafkaOutgoingQueue from "../src/KafkaOutgoingQueue.js";
import KafkaIncomingQueue from "../src/KafkaIncomingQueue.js";
import {
  IncomingQueueMessageAdapterListenerInput,
  QueueMessage,
} from "@mqueue/queue";

const timeout = 260_000;
const topic = "test-topic";

describe("KafkaQueue", { timeout }, () => {
  let container: StartedKafkaContainer;

  test.before(
    async () => {
      container = await new KafkaContainer("confluentinc/cp-kafka:7.5.0")
        .withExposedPorts(9093)
        .start();
    },
    { timeout },
  );

  test.after(
    async () => {
      await container.stop({ timeout: 10_000 });
    },
    { timeout },
  );

  describe("Queue sender connection", { timeout }, () => {
    test("Should connect and disconnect", { timeout }, async () => {
      // Arrange

      // Act
      const connection = await KafkaQueue.Outgoing.connect({
        topic,
        clientOptions: {
          brokers: [`${container.getHost()}:${container.getMappedPort(9093)}`],
        },
      });
      await connection.healthcheck();
      await connection.close();

      // Assert
      // await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let connection: KafkaOutgoingQueue;

    test.before(
      async () => {
        connection = await KafkaQueue.Outgoing.connect({
          topic,
          clientOptions: {
            brokers: [
              `${container.getHost()}:${container.getMappedPort(9093)}`,
            ],
          },
        });
      },
      { timeout },
    );

    test.after(
      async () => {
        await connection.close();
      },
      { timeout },
    );

    test("Should succeed when healthchecked", { timeout }, async () => {
      // Act
      const result = await connection.healthcheck();

      // Assert
      assert.strictEqual(result, undefined);
    });
  });

  describe("Sending messages", { timeout }, () => {
    let connection: KafkaOutgoingQueue;
    let incoming: KafkaIncomingQueue;

    test.before(
      async () => {
        connection = await KafkaQueue.Outgoing.connect({
          topic,
          clientOptions: {
            brokers: [
              `${container.getHost()}:${container.getMappedPort(9093)}`,
            ],
          },
        });

        incoming = await KafkaQueue.Incoming.connect({
          topic,
          clientOptions: {
            clientId: "x",
            brokers: [
              `${container.getHost()}:${container.getMappedPort(9093)}`,
            ],
          },
          consumerOptions: {
            groupId: topic,
          },
        });
      },
      { timeout },
    );

    test.after(
      async () => {
        await connection.close();
        await incoming.close();
      },
      { timeout },
    );

    test("Should send and receive a message", { timeout }, async () => {
      // Arrange
      const body = "This is a message";
      const consumer = mock.fn<() => Promise<void>>();

      // Act
      const result = await connection.sendMessage(
        new QueueMessage({
          body: Buffer.from(body),
          headers: {
            Example: "Example",
          },
        }),
      );

      const received =
        await new Promise<IncomingQueueMessageAdapterListenerInput>(
          (resolve) => {
            incoming.consume(async (payload) => {
              await consumer();
              resolve(payload);
            });
          },
        );

      await incoming.close();

      // Assert
      assert.strictEqual(result, undefined);
      assert.strictEqual(consumer.mock.calls.length, 1);
      assert.equal(received.message.body.toString(), body);
    });
  });
});
