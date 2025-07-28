# fastq for MQueue

A [fastq](https://github.com/mcollina/fastq) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for fastq queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/fastq
# or use pnpm/yarn
```

```ts
import MQueue from "@mqueue/queue"; // or require("@mqueue/queue")
import { FastqQueue } from "@mqueue/fastq"; // or require("@mqueue/fastq")

const incomingQueue = new FastqQueue.Incoming(1);
const outgoingQueue = new FastqQueue.Outgoing(incomingQueue.queue);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

await incomingQueue.consume(async (payload) => {
  // ...
});

// Start listening to the queue
await incomingQueue.consume(async (payload) => {
  const topicOrQueueName = payload.transport.name;
  const headers = payload.message.headers;
  const data = await payload.message.json();
  await payload.accept(); // or await payload.reject();
  // ...
});
```

## Compatibility

- Single-Node NodeJS Applications

## License

[MIT © Dom Webber](./LICENSE)
