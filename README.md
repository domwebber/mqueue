# mqueue (Multi-Queue)

A simple queue interface with support for multiple backends. Keep your
options open.

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

- [ ] amqplib
- [ ] sqs
- [ ] sqs-consumer
- [ ] rhea
- [ ] azure-service-bus

## Strategies

- [ ] Multicast

## Credit

This package was inspired by [keyv](https://github.com/jaredwray/keyv),
[flystorage](https://github.com/duna-oss/flystorage), and
[Flysystem](https://flysystem.thephpleague.com).
