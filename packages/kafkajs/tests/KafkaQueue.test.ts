import assert from "node:assert";
import test, { describe } from "node:test";
import { KafkaContainer, StartedKafkaContainer } from "@testcontainers/kafka";
import KafkaQueue from "../src/KafkaQueue.js";
import KafkaOutgoingQueue from "../src/KafkaOutgoingQueue.js";

const timeout = 180_000;
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
      await container.stop({ timeout });
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
      await assert.rejects(connection.healthcheck);
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

    test("Should send a message", { timeout }, async () => {
      // Arrange
      const body = "This is a message";

      // Act
      const result = await connection.sendMessage({
        headers: {
          Example: "Example",
        },
        body: Buffer.from(body),
      });

      // Assert
      assert.strictEqual(result, undefined);
    });
  });
});
