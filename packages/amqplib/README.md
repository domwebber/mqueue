# amqplib for MQueue

An amqplib adapter (AMQP v0.9.1) for MQueue, adding support for amqplib queues
with a multi-backend setup with MQueue.

```ts
const outgoingQueue new MQueue.Outgoing(
  await AmqplibOutgoingQueue.connect(
    "amqp://rabbitmq:5271",
    "queue-name"
  );
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue new MQueue.Outgoing(
  await AmqplibIncomingQueue.connect(
    "amqp://rabbitmq:5271",
    "queue-name"
  );
);
```
