# amqplib for MQueue

An [amqplib](https://github.com/amqp-node/amqplib) adapter (AMQP v0.9.1) for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for amqplib queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/amqplib
# or use pnpm/yarn
```

```ts
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
```

## Compatibility

- [RabbitMQ](https://rabbitmq.com)
