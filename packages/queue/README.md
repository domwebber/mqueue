# mqueue (Multi-Queue)

A simple queue interface with support for multiple backends. Keep your options
open.

```ts
const outgoingQueue = new MQueue.Outgoing(
  await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await AmqplibIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
);
```

## Adapters

- [ ] [amqplib](/packages/amqplib/README.md)
- [ ] [sqs](/packages/sqs/README.md)
- [ ] [rhea](/packages/rhea/README.md)
- [ ] [azure-service-bus](/packages/azure-service-bus/README.md)

## Strategies

- [ ] [Multicast](/packages/multicast/README.md)
