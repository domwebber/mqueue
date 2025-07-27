import assert from "node:assert";
import test, { describe, mock } from "node:test";
import RheaQueue from "../src/RheaQueue.js";
import RabbitMQContainer, {
  StartedRabbitMQContainer,
} from "./RabbitMQContainer.js";
import RheaOutgoingQueue from "../src/RheaOutgoingQueue.js";
import RheaIncomingQueue from "../src/RheaIncomingQueue.js";
import {
  IncomingQueueMessageAdapterListenerInput,
  QueueMessage,
} from "@mqueue/queue";

const timeout = 180_000;
describe("RheaQueue", { timeout }, () => {
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
      const connection = await RheaQueue.Outgoing.connect(
        container.getAmqpOptions(),
        { target: { address: container.getQueueName() } },
      );
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let connection: RheaOutgoingQueue;

    test.before(
      async () => {
        connection = await RheaQueue.Outgoing.connect(
          container.getAmqpOptions(),
          { target: { address: container.getQueueName() } },
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
    let connection: RheaOutgoingQueue;
    let incoming: RheaIncomingQueue;

    test.before(
      async () => {
        connection = await RheaQueue.Outgoing.connect(
          container.getAmqpOptions(),
          { target: { address: container.getQueueName() } },
        );

        incoming = await RheaQueue.Incoming.connect(
          container.getAmqpOptions(),
          { source: { address: container.getQueueName() } },
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
      const consumer = mock.fn<() => Promise<void>>();

      // Act
      const receipt = new Promise<IncomingQueueMessageAdapterListenerInput>(
        (resolve) => {
          incoming.consume(async (payload) => {
            await consumer();
            resolve(payload);
          });
        },
      );

      const result = await connection.sendMessage(
        new QueueMessage({
          headers: {
            Example: "Example",
          },
          body: Buffer.from(body),
        }),
      );

      const received = await receipt;

      // Assert
      assert.strictEqual(result, undefined);
      assert.strictEqual(consumer.mock.calls.length, 1);
      assert.equal(received.message.body.toString(), body);
    });
  });
});
