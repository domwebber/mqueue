import assert from "node:assert";
import test, { describe } from "node:test";
import StompQueue from "../src/StompQueue.js";
import RabbitMQContainer, {
  StartedRabbitMQContainer,
} from "./RabbitMQContainer.js";
import StompOutgoingQueue from "../src/StompOutgoingQueue.js";

const timeout = 180_000;
const queueName = "/topic/general";
const config = {
  connectHeaders: {
    login: "guest",
    passcode: "guest",
  },
};

describe("StompQueue", { timeout }, () => {
  let container: StartedRabbitMQContainer;

  test.before(
    async () => {
      container = await new RabbitMQContainer().start();
    },
    { timeout },
  );

  test.after(
    async () => {
      await container.stop({ timeout: 10_000 });
    },
    { timeout },
  );

  describe("Queue sender connection", () => {
    test("Should connect and disconnect", { timeout }, async () => {
      // Arrange

      // Act
      const connection = await StompQueue.Outgoing.connect(
        container.getStompUrl(),
        queueName,
        config,
      );
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let connection: StompOutgoingQueue;

    test.before(
      async () => {
        connection = await StompQueue.Outgoing.connect(
          container.getStompUrl(),
          queueName,
          config,
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
    let connection: StompOutgoingQueue;

    test.before(
      async () => {
        connection = await StompQueue.Outgoing.connect(
          container.getStompUrl(),
          queueName,
          config,
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
