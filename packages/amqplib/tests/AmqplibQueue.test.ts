import assert from "node:assert";
import test, { describe, mock } from "node:test";
import AmqplibQueue from "../src/AmqplibQueue.js";
import RabbitMQContainer, {
  StartedRabbitMQContainer,
} from "./RabbitMQContainer.js";
import AmqplibOutgoingQueue from "../src/AmqplibOutgoingQueue.js";
import AmqplibIncomingQueue from "../src/AmqplibIncomingQueue.js";
import {
  IncomingQueueMessageAdapterListenerInput,
  QueueMessage,
} from "@mqueue/queue";

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
      await container.stop({ timeout: 10_000 });
    },
    { timeout },
  );

  describe("Queue sender connection", { timeout }, () => {
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
      await assert.rejects(connection.healthcheck());
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
    let incoming: AmqplibIncomingQueue;

    test.before(
      async () => {
        connection = await AmqplibQueue.Outgoing.connect(
          container.getAmqpUrl(),
          container.getQueueName(),
          {},
        );

        incoming = await AmqplibQueue.Incoming.connect(
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
