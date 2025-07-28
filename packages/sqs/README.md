# Azure Service Bus for MQueue

An [AWS SQS](https://aws.amazon.com/sqs/) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for AWS Simple Queue Service queues with a multi-backend setup
with MQueue. Note: SQS Incoming queue consumption uses
[sqs-consumer](https://github.com/bbc/sqs-consumer).

```bash
npm install --save @mqueue/queue @mqueue/sqs
# or use pnpm/yarn
```

```ts
import MQueue from "@mqueue/queue";
// const MQueue = require("@mqueue/queue");
import { SQSQueue } from "@mqueue/fastq";
// const { SQSQueue } = require("@mqueue/fastq");

const outgoingQueue = new MQueue.Outgoing(
  await SQSQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await SQSQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
);

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

- [AWS Simple Queue Service (SQS)](https://aws.amazon.com/sqs/)
- [ElasticMQ (SQS-Compatible)](https://github.com/softwaremill/elasticmq)

## License

[MIT © Dom Webber](./LICENSE)
