import { OutgoingQueueAdapter, QueueMessage } from "@mqueue/queue";
import { type queueAsPromised, type queue } from "fastq";

export default class FastqOutgoingQueue implements OutgoingQueueAdapter {
  public type = "fastq";

  constructor(
    public queue: queueAsPromised<QueueMessage> | queue<QueueMessage>,
  ) {}

  public async healthcheck(): Promise<void> {
    if (this.queue.paused) {
      throw new Error("Fastq Sender unexpectedly disconnected");
    }
  }

  public async close() {
    this.queue.kill();
  }

  public async sendMessage(message: QueueMessage): Promise<void> {
    this.queue.push(message);
  }
}
