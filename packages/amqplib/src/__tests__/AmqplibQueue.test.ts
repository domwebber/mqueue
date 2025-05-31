import assert from "node:assert";
import test, { describe } from "node:test";
import AmqplibQueue from "../AmqplibQueue.js";
import RabbitMQContainer, {
  StartedRabbitMQContainer,
} from "./RabbitMQContainer.js";
import AmqplibOutgoingQueue from "../AmqplibOutgoingQueue.js";

const timeout = 180_000;
describe("AmqplibQueue", { timeout }, () => {
  let container: StartedRabbitMQContainer;

  test.before(
    async () => {
      container = await new RabbitMQContainer().start();
    },
    { timeout },
  );

  test.after(
    async () => {
      await container.stop();
    },
    { timeout },
  );

  describe("Queue sender connection", () => {
    test("Should connect and disconnect", { timeout }, async () => {
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

  describe("Healthchecking connection", { timeout }, () => {
    let connection: AmqplibOutgoingQueue;

    test.before(
      async () => {
        connection = await AmqplibQueue.Outgoing.connect(
          container.getAmqpUrl(),
          container.getQueueName(),
          {},
        );
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
    let connection: AmqplibOutgoingQueue;

    test.before(
      async () => {
        connection = await AmqplibQueue.Outgoing.connect(
          container.getAmqpUrl(),
          container.getQueueName(),
          {},
        );
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
