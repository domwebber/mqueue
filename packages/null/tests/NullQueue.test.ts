import assert from "node:assert";
import test, { describe } from "node:test";
import NullQueue from "../src/NullQueue.js";
import NullIncomingQueue from "../src/NullIncomingQueue.js";
import NullOutgoingQueue from "../src/NullOutgoingQueue.js";

const timeout = 12_000;
describe("NullQueue", { timeout }, () => {
  describe("Queue sender connection", () => {
    test("Should connect and disconnect", { timeout }, async () => {
      // Act
      const connection = new NullQueue.Outgoing();
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let incoming: NullIncomingQueue;
    let outgoing: NullOutgoingQueue;

    test.before(
      async () => {
        incoming = new NullQueue.Incoming();
        outgoing = new NullQueue.Outgoing();
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
    let incoming: NullIncomingQueue;
    let outgoing: NullOutgoingQueue;

    test.before(
      async () => {
        incoming = new NullQueue.Incoming();
        outgoing = new NullQueue.Outgoing();
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
      // Act
      const result = await outgoing.sendMessage();

      // Assert
      assert.strictEqual(result, undefined);
    });
  });
});
