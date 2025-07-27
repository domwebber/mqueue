# KafkaJS for MQueue

An [KafkaJS](https://github.com/tulios/kafkajs) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for Kafka queues with a multi-backend setup with MQueue.

> Note: This Queue Adapter is a Work in Progress.

```bash
npm install --save @mqueue/queue @mqueue/kafkajs
# or use pnpm/yarn
```

```ts
const outgoingQueue = new MQueue.Outgoing(
  await KafkaQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await KafkaQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
);
```

## Compatibility

- [Apache Kafka](https://kafka.apache.org)

## License

[MIT © Dom Webber](./LICENSE)
