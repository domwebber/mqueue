import assert from "node:assert";
import test, { describe, mock } from "node:test";
import FastqQueue from "../src/FastqQueue.js";
import FastqIncomingQueue from "../src/FastqIncomingQueue.js";
import FastqOutgoingQueue from "../src/FastqOutgoingQueue.js";
import { IncomingQueueMessageListenerInput } from "@mqueue/queue";

const timeout = 180_000;
describe("FastqQueue", { timeout }, () => {
  describe("Queue sender connection", () => {
    test("Should connect and disconnect", { timeout }, async () => {
      // Arrange

      // Act
      const incoming = new FastqQueue.Incoming(1);
      const connection = new FastqQueue.Outgoing(incoming.queue);
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let incoming: FastqIncomingQueue;
    let outgoing: FastqOutgoingQueue;

    test.before(
      async () => {
        incoming = new FastqQueue.Incoming(1);
        outgoing = new FastqQueue.Outgoing(incoming.queue);
      },
      { timeout },
    );

    test.after(
      async () => {
        await outgoing.close();
        await incoming.close();
      },
      { timeout },
    );

    test("Should succeed when healthchecked", { timeout }, async () => {
      // Act
      const result = await outgoing.healthcheck();

      // Assert
      assert.strictEqual(result, undefined);
    });
  });

  describe("Sending messages", { timeout }, () => {
    let incoming: FastqIncomingQueue;
    let outgoing: FastqOutgoingQueue;

    test.before(
      async () => {
        incoming = new FastqQueue.Incoming(1);
        outgoing = new FastqQueue.Outgoing(incoming.queue);
      },
      { timeout },
    );

    test.after(
      async () => {
        await outgoing.close();
        await incoming.close();
      },
      { timeout },
    );

    test("Should send a message", { timeout }, async () => {
      // Arrange
      const body = "This is a message";
      const consumer = mock.fn<() => Promise<void>>();

      // Act
      const receipt = new Promise<IncomingQueueMessageListenerInput>(
        (resolve) => {
          incoming.consume(async (payload) => {
            await consumer();
            resolve(payload);
          });
        },
      );

      const result = await outgoing.sendMessage({
        headers: {
          Example: "Example",
        },
        body: Buffer.from(body),
      });

      const received = await receipt;

      // Assert
      assert.strictEqual(result, undefined);
      assert.strictEqual(consumer.mock.calls.length, 1);
      assert.equal(received.message.body.toString(), body);
    });
  });
});
