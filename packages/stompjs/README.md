# STOMP.js for MQueue

An [STOMP.js](https://github.com/stomp-js/stompjs) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for STOMP queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/stompjs
# or use pnpm/yarn
```

```ts
const outgoingQueue = new MQueue.Outgoing(
  await StompQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await StompQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
);
```

## Compatibility

- [RabbitMQ (with STOMP plugin)](https://rabbitmq.com)
- [Apache ActiveMQ](https://activemq.apache.org)
