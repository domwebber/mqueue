import assert from "node:assert";
import test, { describe } from "node:test";
import ElasticMQContainer, {
  StartedElasticMQContainer,
} from "./ElasticMQContainer.js";
import SQSQueue from "../src/SQSQueue.js";
import SQSOutgoingQueue from "../src/SQSOutgoingQueue.js";

const timeout = 180_000;
const url = "/queue1";
const region = "elasticmq";
const credentials = {
  accessKeyId: "x",
  secretAccessKey: "x",
};

describe("SQSQueue", { timeout }, () => {
  let container: StartedElasticMQContainer;

  test.before(
    async () => {
      container = await new ElasticMQContainer().start();
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
      const connection = await SQSQueue.Outgoing.connect(url, {
        clientConfig: {
          credentials,
          region,
          endpoint: container.getSQSUrl(),
        },
      });
      await connection.healthcheck();
      await connection.close();

      // Assert
      await assert.rejects(connection.healthcheck);
    });
  });

  describe("Healthchecking connection", { timeout }, () => {
    let connection: SQSOutgoingQueue;

    test.before(
      async () => {
        connection = await SQSQueue.Outgoing.connect(url, {
          clientConfig: {
            credentials,
            region,
            endpoint: container.getSQSUrl(),
          },
        });
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
    let connection: SQSOutgoingQueue;
    // let incoming: SQSIncomingQueue;

    test.before(
      async () => {
        connection = await SQSQueue.Outgoing.connect(url, {
          clientConfig: {
            credentials,
            region,
            endpoint: container.getSQSUrl(),
          },
        });

        // incoming = await SQSQueue.Incoming.connect(url, {
        //   clientConfig: {
        //     credentials,
        //     region,
        //     endpoint: container.getSQSUrl(),
        //   },
        // });
      },
      { timeout },
    );

    test.after(
      async () => {
        await connection.close();
        // await incoming.close();
      },
      { timeout },
    );

    test("Should send a message", { timeout }, async () => {
      // Arrange
      const body = "This is a message";
      // const consumer = mock.fn<() => Promise<void>>();

      // Act
      const result = await connection.sendMessage({
        headers: {
          Example: "Example",
        },
        body: Buffer.from(body),
      });

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
