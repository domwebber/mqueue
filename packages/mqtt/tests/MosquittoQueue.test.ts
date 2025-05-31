import assert from "node:assert";
import test, { describe } from "node:test";
import MosquittoContainer, {
  StartedMosquittoContainer,
} from "./MosquittoContainer.js";
import MqttQueue from "../src/MqttQueue.js";
import MqttOutgoingQueue from "../src/MqttOutgoingQueue.js";

const timeout = 180_000;
describe("MosquittoQueue", { timeout }, () => {
  let container: StartedMosquittoContainer;

  test.before(
    async () => {
      container = await new MosquittoContainer().start();
      console.log("Port", container.getMqttUrl());
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
    test("Should connect and disconnect", async () => {
      // Arrange

      // Act
      const connection = await MqttQueue.Outgoing.connect(
        "example",
        container.getMqttUrl(),
        {},
        true,
      );
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", () => {
    let connection: MqttOutgoingQueue;

    test.before(async () => {
      connection = await MqttQueue.Outgoing.connect(
        "example",
        container.getMqttUrl(),
        {},
        true,
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
    let connection: MqttOutgoingQueue;

    test.before(async () => {
      connection = await MqttQueue.Outgoing.connect(
        "example",
        container.getMqttUrl(),
        {},
        true,
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
