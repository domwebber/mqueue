# amqplib for MQueue

An [amqplib](https://github.com/amqp-node/amqplib) adapter (AMQP v0.9.1) for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for amqplib queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/amqplib
# or use pnpm/yarn
```

```ts
import MQueue from "@mqueue/queue"; // or require("@mqueue/queue");
import { AmqplibQueue } from "@mqueue/amqplib"; // oe require("@mqueue/amqplib");

const outgoingQueue = new MQueue.Outgoing(
  await AmqplibQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await AmqplibQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
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

- [RabbitMQ](https://rabbitmq.com)

## License

[MIT © Dom Webber](./LICENSE)
