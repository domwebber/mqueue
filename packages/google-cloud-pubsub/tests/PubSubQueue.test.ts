import assert from "node:assert";
import test, { describe } from "node:test";
import PubSubContainer, { StartedPubSubContainer } from "./PubSubContainer.js";
import PubSubQueue from "../src/PubSubQueue.js";
import PubSubOutgoingQueue from "../src/PubSubOutgoingQueue.js";
import { QueueMessage } from "@mqueue/queue";
import PubSubIncomingQueue from "../src/PubSubIncomingQueue.js";

const projectId = "tokyo-rain-123";
const timeout = 180_000;
const topic = "some-topic";
describe("PubSubQueue", { timeout }, () => {
  let container: StartedPubSubContainer;

  test.before(
    async () => {
      container = await new PubSubContainer().start();
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
      const connection = await PubSubQueue.Outgoing.connect(
        {
          apiEndpoint: container.getEndpoint(),
          emulatorMode: true,
          projectId,
        },
        // container.getASBUrl(),
        topic,
      );
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck());
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let connection: PubSubOutgoingQueue;

    test.before(
      async () => {
        connection = await PubSubQueue.Outgoing.connect(
          {
            apiEndpoint: container.getEndpoint(),
            emulatorMode: true,
            projectId,
          },
          topic,
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

  describe("Sending messages", { skip: true, timeout }, () => {
    let connection: PubSubOutgoingQueue;
    let incoming: PubSubIncomingQueue;

    test.before(
      async () => {
        connection = await PubSubQueue.Outgoing.connect(
          {
            apiEndpoint: container.getEndpoint(),
            emulatorMode: true,
            projectId,
          },
          topic,
        );

        incoming = await PubSubQueue.Incoming.connect(
          {
            apiEndpoint: container.getEndpoint(),
            emulatorMode: true,
            projectId,
          },
          topic,
          "subscription-123",
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
      const result = await connection.sendMessage(
        new QueueMessage({
          headers: {
            Example: "Example",
          },
          body: Buffer.from(body),
        }),
      );

      // const received = await new Promise<IncomingQueueMessageListenerInput>(
      //   (resolve) => {
      //     incoming.consume(async (payload) => {
      //       await consumer();
      //       resolve(payload);
      //     });
      //   },
      // );

      // Assert
      assert.strictEqual(result, undefined);
      // assert.strictEqual(consumer.mock.calls.length, 1);
      // assert.equal(received.message.body.toString(), body);
    });
  });
});
