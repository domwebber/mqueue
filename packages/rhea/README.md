# rhea for MQueue

An [rhea](https://github.com/amqp/rhea) adapter (AMQP v1.0) for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for rhea queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/rhea
# or use pnpm/yarn
```

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

## Compatibility

- [RabbitMQ v4 and later](https://rabbitmq.com)
- [RabbitMQ v3 and earler, with the AMQP v1.0 plugin](https://rabbitmq.com)
- [ActiveMQ](https://activemq.apache.org)
- [Azure Service Bus](https://azure.microsoft.com/products/service-bus) -
  **Note**: identity and authentication is easier with the
  [dedicated Azure Service Bus queue adapter](https://github.com/domwebber/mqueue/blob/main/packages/azure-service-bus/README.md)
