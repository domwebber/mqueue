import {
  IncomingQueueAdapter,
  IncomingQueueMessageListener,
  QueueMessage,
} from "@mqueue/queue";
import { promise as fastqPromise, type queueAsPromised } from "fastq";

export default class FastqIncomingQueue implements IncomingQueueAdapter {
  public type = "fastq";

  public queue: queueAsPromised<QueueMessage, unknown>;
  protected _consumer?: (task: QueueMessage) => Promise<void>;

  constructor(concurrency = 1) {
    this.queue = fastqPromise(
      async (...options) => this._consumer?.(...options),
      concurrency,
    );
  }

  public async healthcheck(): Promise<void> {
    if (this.queue.paused) {
      throw new Error("Fastq Sender unexpectedly disconnected");
    }
  }

  public async close() {
    this._consumer = undefined;
    this.queue.kill();
  }

  public async consume(callback: IncomingQueueMessageListener): Promise<void> {
    this._consumer = async (message) => {
      await callback({
        accept: async () => {},
        reject: async () => {},
        transport: {
          name: "",
        },
        message,
      });
    };
  }
}
