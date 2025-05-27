# Mulitcast Strategy for MQueue

Broadcast a message to multiple different queue backends simultaneously, with
the same interface.

```ts
const outgoingQueue = new MQueue.Outgoing(
  new MulticastOutgoingQueue([
    await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
    await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
  ]),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Outgoing(
  new MulticastIncomingQueue([
    await AmqplibIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
    await AmqplibIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
  ]),
);
```
