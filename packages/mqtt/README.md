# MQTT.js for MQueue

An [MQTT](https://github.com/mqttjs/MQTT.js) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for MQTT queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/mqtt
# or use pnpm/yarn
```

```ts
import MQueue from "@mqueue/queue";
// const MQueue = require("@mqueue/queue");
import { MqttQueue } from "@mqueue/mqtt";
// const { MqttQueue } = require("@mqueue/mqtt");

const outgoingQueue = new MQueue.Outgoing(
  await MqttQueue.Outgoing.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await MqttQueue.Incoming.connect("amqp://rabbitmq:5271", "queue-name"),
);

// Start listening to the queue
await incomingQueue.consume(async (payload) => {
  const topicOrQueueName = payload.transport.name;
  const headers = payload.message.headers;
  const data = await payload.message.json();
  await payload.accept(); // or await payload.reject();
  // ...
});
```

## Compatibility

- [Eclipse Mosquitto](https://mosquitto.org)

## License

[MIT © Dom Webber](./LICENSE)
