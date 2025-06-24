import assert from "node:assert";
import test, { describe } from "node:test";
import MulticastQueue from "../src/MulticastQueue.js";
import MulticastIncomingQueue from "../src/MulticastIncomingQueue.js";
import MulticastOutgoingQueue from "../src/MulticastOutgoingQueue.js";
import { NullQueue } from "@mqueue/null";

const timeout = 12_000;
describe("MulticastQueue", { timeout }, () => {
  describe("Queue sender connection", () => {
    test("Should connect and disconnect", { timeout }, async () => {
      // Act
      const connection = new MulticastQueue.Outgoing([
        new NullQueue.Outgoing(),
        new NullQueue.Outgoing(),
      ]);
      await connection.healthcheck();
      await connection.close();

      // Assert
      // await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let incoming: MulticastIncomingQueue;
    let outgoing: MulticastOutgoingQueue;

    test.before(
      async () => {
        incoming = new MulticastQueue.Incoming([
          new NullQueue.Incoming(),
          new NullQueue.Incoming(),
        ]);
        outgoing = new MulticastQueue.Outgoing([
          new NullQueue.Outgoing(),
          new NullQueue.Outgoing(),
        ]);
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
    let incoming: MulticastIncomingQueue;
    let outgoing: MulticastOutgoingQueue;

    test.before(
      async () => {
        incoming = new MulticastQueue.Incoming([
          new NullQueue.Incoming(),
          new NullQueue.Incoming(),
        ]);
        outgoing = new MulticastQueue.Outgoing([
          new NullQueue.Outgoing(),
          new NullQueue.Outgoing(),
        ]);
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

      // Act
      const result = await outgoing.sendMessage({
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
