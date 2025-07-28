# KafkaJS for MQueue

An [KafkaJS](https://github.com/tulios/kafkajs) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for Kafka queues with a multi-backend setup with MQueue.

> Note: This Queue Adapter is a Work in Progress.

```bash
npm install --save @mqueue/queue @mqueue/kafkajs
# or use pnpm/yarn
```

```ts
import MQueue from "@mqueue/queue"; // or require("@mqueue/queue");
import { KafkaQueue } from "@mqueue/kafkajs"; // or require("@mqueue/kafkajs");

const outgoingQueue = new MQueue.Outgoing(
  await KafkaQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await KafkaQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
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

- [Apache Kafka](https://kafka.apache.org)

## License

[MIT © Dom Webber](./LICENSE)
