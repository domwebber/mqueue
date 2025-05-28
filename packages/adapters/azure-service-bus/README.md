# Azure Service Bus for MQueue

An [Azure Service Bus](https://azure.microsoft.com/products/service-bus) adapter
for MQueue, adding support for Azure Service Bus queues with a multi-backend
setup with MQueue. Note: Azure Service Bus is also compatible with AMQP v1.0 and
thus compatible with the Rhea MQueue adapter (which it uses under-the-hood),
however, you may achieve a better experience (particularly with Azure
authentication and identity) by using the specialised adapter.

```bash
npm install --save @mqueue/queue @mqueue/azure-service-bus
# or use pnpm/yarn
```

```ts
const outgoingQueue = new MQueue.Outgoing(
  await AzureServiceBusQueue.Outgoing.connect(
    "amqp://rabbitmq:5271",
    "queue-name",
  ),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await AzureServiceBusQueue.Incoming.connect(
    "amqp://rabbitmq:5271",
    "queue-name",
  ),
);
```
