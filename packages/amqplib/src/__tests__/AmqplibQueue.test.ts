import assert from "node:assert";
import test, { describe } from "node:test";
import AmqplibQueue from "../AmqplibQueue.js";
import RabbitMQContainer, {
  StartedRabbitMQContainer,
} from "./RabbitMQContainer.js";
import AmqplibOutgoingQueue from "../AmqplibOutgoingQueue.js";

describe("AmqplibQueue", { timeout: 180_000 }, () => {
  let container: StartedRabbitMQContainer;

  test.before(async () => {
    container = await new RabbitMQContainer().start();
  });

  test.after(async () => {
    await container.stop();
  });

  describe("Queue sender connection", () => {
    test("Should connect and disconnect", async () => {
      // Arrange

      // Act
      const connection = await AmqplibQueue.Outgoing.connect(
        container.getAmqpUrl(),
        container.getQueueName(),
        {},
      );
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", () => {
    let connection: AmqplibOutgoingQueue;

    test.before(async () => {
      connection = await AmqplibQueue.Outgoing.connect(
        container.getAmqpUrl(),
        container.getQueueName(),
        {},
      );
    });

    test.after(async () => {
      await connection.close();
    });

    test("Should succeed when healthchecked", async () => {
      // Act
      const result = await connection.healthcheck();

      // Assert
      assert.strictEqual(result, undefined);
    });
  });

  describe("Sending messages", () => {
    let connection: AmqplibOutgoingQueue;

    test.before(async () => {
      connection = await AmqplibQueue.Outgoing.connect(
        container.getAmqpUrl(),
        container.getQueueName(),
        {},
      );
    });

    test.after(async () => {
      await connection.close();
    });

    test("Should send a message", async () => {
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
