# MQTT.js for MQueue

An [MQTT](https://github.com/mqttjs/MQTT.js) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for MQTT queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/mqtt
# or use pnpm/yarn
```

```ts
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
```

## Compatibility

- [Eclipse Mosquitto](https://mosquitto.org)
