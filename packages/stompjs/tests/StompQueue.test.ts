import assert from "node:assert";
import test, { describe } from "node:test";
import StompQueue from "../src/StompQueue.js";
import RabbitMQContainer, {
  StartedRabbitMQContainer,
} from "./RabbitMQContainer.js";
import StompOutgoingQueue from "../src/StompOutgoingQueue.js";
import StompIncomingQueue from "../src/StompIncomingQueue.js";
import { QueueMessage } from "@mqueue/queue";

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
      await assert.rejects(connection.healthcheck());
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
    let incoming: StompIncomingQueue;

    test.before(
      async () => {
        connection = await StompQueue.Outgoing.connect(
          container.getStompUrl(),
          queueName,
          config,
        );

        incoming = await StompQueue.Incoming.connect(
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
        await incoming.close();
      },
      { timeout },
    );

    test("Should send a message", { timeout }, async () => {
      // Arrange
      const body = "This is a message";
      // const consumer = mock.fn<() => Promise<void>>();

      // Act
      // const receipt = new Promise<IncomingQueueMessageListenerInput>(
      //   (resolve) => {
      //     incoming.consume(async (payload) => {
      //       await consumer();
      //       resolve(payload);
      //     });
      //   },
      // );

      const result = await connection.sendMessage(
        new QueueMessage({
          headers: {
            Example: "Example",
          },
          body: Buffer.from(body),
        }),
      );

      // const received = await receipt;

      // Assert
      assert.strictEqual(result, undefined);
      // assert.strictEqual(consumer.mock.calls.length, 1);
      // assert.equal(received.message.body.toString(), body);
    });
  });
});
