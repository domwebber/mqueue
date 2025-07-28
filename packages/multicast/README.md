# Mulitcast Strategy for MQueue

Broadcast a message to multiple different
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md)
queue backends simultaneously, with the same interface. Publish to
[amqplib](/packages/adapters/amqplib/README.md),
[azure-service-bus](/packages/adapters/azure-service-bus/README.md),
[rhea](/packages/adapters/rhea/README.md), and
[sqs](/packages/adapters/sqs/README.md) with one call.

```bash
npm install --save @mqueue/queue @mqueue/multicast # + Adapter(s)...
# or use pnpm/yarn
```

```ts
const outgoingQueue = new MQueue.Outgoing(
  new MulticastQueue.Outgoing([
    await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
    await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5272", "queue-name2"),
  ]),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  new MulticastQueue.Incoming([
    await AmqplibIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
    await AmqplibIncomingQueue.connect("amqp://rabbitmq:5272", "queue-name2"),
  ]),
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

## Filtering & Randomisation

```ts
import MQueue from "@mqueue/queue";
// const MQueue = require("@mqueue/queue");
import { MulticastQueue } from "@mqueue/multicast";
// const { MulticastQueue } = require("@mqueue/multicast");

// Select one random adapter (for example)
const filter = (adapters) => [adapters[randomInt(adapters.length)]];

// Or filter by message detail
cosnt filter = (adapters, message) => {
  return message.headers.example === "something" ? adapter[0] : adapter;
};

const outgoingQueue = new MQueue.Outgoing(
  new MulticastQueue.Outgoing([
    await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
    await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5272", "queue-name2"),
  ]),
  { filter },
);

// ...

const incomingQueue = new MQueue.Incoming(
  new MulticastQueue.Incoming([
    await AmqplibIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
    await AmqplibIncomingQueue.connect("amqp://rabbitmq:5272", "queue-name2"),
  ]),
  { filter },
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

## License

[MIT © Dom Webber](./LICENSE)
