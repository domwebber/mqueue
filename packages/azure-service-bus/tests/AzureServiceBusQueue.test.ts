import assert from "node:assert";
import test, { describe } from "node:test";
import AzureServiceBusContainer, {
  StartedAzureServiceBusContainer,
} from "./AzureServiceBusContainer.js";
import AzureServiceBusQueue from "../src/AzureServiceBusQueue.js";
import AzureServiceBusOutgoingQueue from "../src/AzureServiceBusOutgoingQueue.js";
import MSSQLContainer, { StartedMSSQLContainer } from "./MSSQLContainer.js";
import { Network, StartedNetwork } from "testcontainers";

const timeout = 180_000;
const topic = "topic.1";
describe("AzureServiceBusQueue", { timeout }, () => {
  let network: StartedNetwork;
  let sqledge: StartedMSSQLContainer;
  let container: StartedAzureServiceBusContainer;

  test.before(
    async () => {
      network = await new Network().start();
      sqledge = await new MSSQLContainer()
        .withNetworkMode(network.getName())
        .start();
      container = await new AzureServiceBusContainer({
        // host: sqledge.getHost(),
        host: "sqledge",
        password: sqledge.getPassword(),
      })
        .withNetworkMode(network.getName())
        .start();
    },
    { timeout },
  );

  test.after(
    async () => {
      await container.stop({ timeout });
      await sqledge.stop({ timeout });
      await network.stop();
    },
    { timeout },
  );

  describe("Queue sender connection", () => {
    test("Should connect and disconnect", { timeout }, async () => {
      // Arrange

      // Act
      const connection = await AzureServiceBusQueue.Outgoing.connect(
        container.getASBUrl(),
        topic,
      );
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let connection: AzureServiceBusOutgoingQueue;

    test.before(
      async () => {
        connection = await AzureServiceBusQueue.Outgoing.connect(
          container.getASBUrl(),
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

  describe("Sending messages", { timeout }, () => {
    let connection: AzureServiceBusOutgoingQueue;

    test.before(
      async () => {
        connection = await AzureServiceBusQueue.Outgoing.connect(
          container.getASBUrl(),
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
