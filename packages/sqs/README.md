# Azure Service Bus for MQueue

An [AWS SQS](https://aws.amazon.com/sqs/) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for AWS Simple Queue Service queues with a multi-backend setup
with MQueue. Note: SQS Incoming queue consumption uses
[sqs-consumer](https://github.com/bbc/sqs-consumer).

```bash
npm install --save @mqueue/queue @mqueue/sqs
# or use pnpm/yarn
```

```ts
const outgoingQueue = new MQueue.Outgoing(
  await SQSQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await SQSQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
);
```

## Compatibility

- [AWS Simple Queue Service (SQS)](https://aws.amazon.com/sqs/)
- [ElasticMQ (SQS-Compatible)](https://github.com/softwaremill/elasticmq)
