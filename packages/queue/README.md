# mqueue (Multi-Queue)

A simple queue interface with support for multiple backends. Keep your options
open.

## Installation

Install MQueue and select adapters:

```bash
# Install MQueue:
npm install --save @mqueue/queue # + Adapter(s)...
# or use pnpm/yarn

# Install some adapters
npm install --save @mqueue/amqplib
npm install --save @mqueue/azure-service-bus
npm install --save @mqueue/rhea
npm install --save @mqueue/sqs
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

## Queue Adapters

- [amqplib](https://github.com/domwebber/mqueue/blob/main/packages/amqplib/README.md)
- [sqs](https://github.com/domwebber/mqueue/blob/main/packages/sqs/README.md)
- [rhea](https://github.com/domwebber/mqueue/blob/main/packages/rhea/README.md)
- [azure-service-bus](https://github.com/domwebber/mqueue/blob/main/packages/azure-service-bus/README.md)

## Broadcast Strategies

- [Multicast](https://github.com/domwebber/mqueue/blob/main/packages/multicast/README.md)
