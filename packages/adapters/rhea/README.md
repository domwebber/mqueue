# rhea for MQueue

An rhea adapter (AMQP v1.0) for MQueue, adding support for rhea queues with a
multi-backend setup with MQueue.

```ts
const outgoingQueue = new MQueue.Outgoing(
  await RheaQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await RheaQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
);
```
