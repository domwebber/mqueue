# Mulitcast Strategy for MQueue

Broadcast a message to multiple different queue backends simultaneously, with
the same interface.

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
```
