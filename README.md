# mqueue (Multi-Queue)

A simple queue interface with support for multiple backends. Keep your options
open.

```bash
npm install --save @mqueue/queue @mqueue/amqplib
# or use pnpm/yarn
```

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

```ts
// Example: Switching between AMQP v0.9.1 and SQS for live and production
const isProduction = process.env.NODE_ENV === "production";

const outgoingQueue = new MQueue.Outgoing(
  isProduction
    ? await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name")
    : await SQSOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  isProduction
    ? await AmqplibIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name")
    : await SQSIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
);
```

## Credit

This package was inspired by [Keyv](https://github.com/jaredwray/keyv),
[Flystorage](https://github.com/duna-oss/flystorage), and
[Flysystem](https://flysystem.thephpleague.com).

The concept for this package was to create the
[Keyv](https://github.com/jaredwray/keyv) for Queue backends - simply
abstracting the interface for different queue backends to remain flexible and
keep options open.
