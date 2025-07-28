# mqueue (Multi-Queue)

Simple queue interface with support for multiple backends. Keep your options
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
npm install --save @mqueue/google-cloud-pubsub
npm install --save @mqueue/rhea
npm install --save @mqueue/sqs
npm install --save @mqueue/mqtt
npm install --save @mqueue/kafkajs
npm install --save @mqueue/stompjs
npm install --save @mqueue/fastq
```

```ts
import MQueue from "@mqueue/queue"; // or require("@mqueue/queue");

const outgoingQueue = new MQueue.Outgoing(
  await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
);

// Send a message to the queue
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

// Start listening to the queue
await incomingQueue.consume(async (payload) => {
  const topicOrQueueName = payload.transport.name;
  const headers = payload.message.headers;
  const data = await payload.message.json();
  await payload.accept(); // or await payload.reject();
  // ...
});
```

## Queue Adapters

- [`@mqueue/amqplib`][]: AMQP v0.9.1 queue adapter
- [`@mqueue/sqs`][]: AWS Simple Queue Service (SQS) queue adapter
- [`@mqueue/rhea`][]: AMQP v1.0 queue adapter
- [`@mqueue/azure-service-bus`][]: Azure Service Bus queue adapter
- [`@mqueue/google-cloud-pubsub`][]; Google Cloud Pub/Sub adapter
- [`@mqueue/mqtt`][]: MQTT Queue Adapter
- [`@mqueue/kafkajs`][]: Kafka Queue Adapter
- [`@mqueue/stompjs`][]: STOMP Queue Adapter
- [`@mqueue/fastq`][]: Fastq In-Memory Queue Adapter

## Broadcast Strategies

- [`@mqueue/multicast`][]: Multi-queue simultaneous publishing/consumption
  strategy

## Compatibility

[Why might you need a Message Queue?](https://blog.bytebytego.com/p/why-do-we-need-a-message-queue)

- **NodeJS** v18+, tested on v22+

| Queue Platform                                | Queue Adapter                     |
| --------------------------------------------- | --------------------------------- |
| Apache ActiveMQ (AMQP v1.0)                   | [`@mqueue/rhea`][]                |
| Apache ActiveMQ (MQTT)                        | [`@mqueue/mqtt`][]                |
| Apache ActiveMQ (STOMP)                       | [`@mqueue/stompjs`][]             |
| Apache Kafka                                  | [`@mqueue/kafkajs`][]             |
| AWS Simple Queue Service (SQS)                | [`@mqueue/sqs`][]                 |
| Azure Service Bus                             | [`@mqueue/azure-service-bus`][]   |
| Azure Service Bus (AMQP v1.0) [^1]            | [`@mqueue/rhea`][]                |
| Eclipe Mosquitto                              | [`@mqueue/mqtt`][]                |
| ElasticMQ (SQS-Compatible)                    | [`@mqueue/sqs`][]                 |
| EMQX (MQTT)                                   | [`@mqueue/mqtt`][]                |
| Fastq                                         | [`@mqueue/fastq`][]               |
| Google Cloud Pub/Sub                          | [`@mqueue/google-cloud-pubsub`][] |
| HiveMQ (MQTT)                                 | [`@mqueue/mqtt`][]                |
| RabbitMQ (AMQP v0.9.1)                        | [`@mqueue/amqplib`][]             |
| RabbitMQ (AMQP v1.0 or with AMQP v1.0 Plugin) | [`@mqueue/rhea`][]                |
| RabbitMQ (with MQTT Plugin)                   | [`@mqueue/mqtt`][]                |
| RabbitMQ (with STOMP Plugin)                  | [`@mqueue/stompjs`][]             |
| IBM MQ (AMQP v1.0)                            | [`@mqueue/rhea`][]                |

## Examples

```ts
// Example: Switching between AMQP v0.9.1 and SQS for development and production
const isProduction = process.env.NODE_ENV === "production";

const outgoingQueue = new MQueue.Outgoing(
  isProduction
    ? await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name")
    : await SQSOutgoingQueue.connect("/queue1", {
        credentials: { accessKeyId: "x", secretAccessKey: "x" },
        region: "elasticmq", // or applicable AWS region for SQS
        endpoint: "http://elasticmq:9324",
      }),
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
    : await SQSIncomingQueue.connect("/queue1", {
        credentials: { accessKeyId: "x", secretAccessKey: "x" },
        region: "elasticmq", // or applicable AWS region for SQS
        endpoint: "http://elasticmq:9324",
      }),
);
```

```ts
// Adding digital signature verification
import { SignatureHashHook } from "@mqueue/queue";

const outgoingQueue = new MQueue.Outgoing(
  await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
  { onSend: [SignatureHashHook.outgoing()] },
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
  { onReceipt: [SignatureHashHook.incoming()] },
);
```

## License

[MIT © Dom Webber](./LICENSE)

[^1]:
    Better authentication integration may be achieved with Azure Service bus by
    using [`@mqueue/azure-service-bus`][] instead of [`@mqueue/rhea`][].

[`@mqueue/queue`]:
  https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md
[`@mqueue/amqplib`]:
  https://github.com/domwebber/mqueue/blob/main/packages/amqplib/README.md
[`@mqueue/sqs`]:
  https://github.com/domwebber/mqueue/blob/main/packages/sqs/README.md
[`@mqueue/rhea`]:
  https://github.com/domwebber/mqueue/blob/main/packages/rhea/README.md
[`@mqueue/azure-service-bus`]:
  https://github.com/domwebber/mqueue/blob/main/packages/azure-service-bus/README.md
[`@mqueue/mqtt`]:
  https://github.com/domwebber/mqueue/blob/main/packages/mqtt/README.md
[`@mqueue/kafkajs`]:
  https://github.com/domwebber/mqueue/blob/main/packages/kafkajs/README.md
[`@mqueue/stompjs`]:
  https://github.com/domwebber/mqueue/blob/main/packages/stompjs/README.md
[`@mqueue/fastq`]:
  https://github.com/domwebber/mqueue/blob/main/packages/fastq/README.md
[`@mqueue/google-cloud-pubsub`]:
  https://github.com/domwebber/mqueue/blob/main/packages/google-cloud-pubsub/README.md
[`@mqueue/multicast`]:
  https://github.com/domwebber/mqueue/blob/main/packages/multicast/README.md
