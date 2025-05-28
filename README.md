# mqueue (Multi-Queue)

Simple queue interface with support for multiple backends. Keep your options
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

## Getting Started

To learn how to use MQueue, check out the
[`@mqueue/queue`](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md)
README. To learn how to use a specific queue adapter, check out the README for
that adapter under [Queue Adapters](#queue-adapters).

## Packages

- [MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md):
  Simple queue interface with support for multiple backends

## Queue Adapters

- [amqplib](https://github.com/domwebber/mqueue/blob/main/packages/amqplib/README.md):
  AMQP v0.9.1 queue adapter
- [sqs](https://github.com/domwebber/mqueue/blob/main/packages/sqs/README.md):
  AWS Simple Queue Service (SQS) queue adapter
- [rhea](https://github.com/domwebber/mqueue/blob/main/packages/rhea/README.md):
  AMQP v1.0 queue adapter
- [azure-service-bus](https://github.com/domwebber/mqueue/blob/main/packages/azure-service-bus/README.md):
  Azure Service Bus queue adapter

## Broadcast Strategies

- [Multicast](https://github.com/domwebber/mqueue/blob/main/packages/multicast/README.md):
  Multi-queue simultaneous publishing strategy

## Credit

This package was inspired by [Keyv](https://github.com/jaredwray/keyv),
[Flystorage](https://github.com/duna-oss/flystorage), and
[Flysystem](https://flysystem.thephpleague.com).

The concept for this package was to create the
[Keyv](https://github.com/jaredwray/keyv) for Queue backends - simply
abstracting the interface for different queue backends to remain flexible and
keep options open.

## License

[MIT © Dom Webber](./LICENSE)
