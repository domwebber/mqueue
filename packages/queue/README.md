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
npm install --save @mqueue/rhea
npm install --save @mqueue/sqs
npm install --save @mqueue/mqtt
npm install --save @mqueue/kafkajs
npm install --save @mqueue/stompjs
npm install --save @mqueue/fastq
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

- [`@mqueue/amqplib`][]: AMQP v0.9.1 queue adapter
- [`@mqueue/sqs`][]: AWS Simple Queue Service (SQS) queue adapter
- [`@mqueue/rhea`][]: AMQP v1.0 queue adapter
- [`@mqueue/azure-service-bus`][]: Azure Service Bus queue adapter
- [`@mqueue/mqtt`][]: MQTT Queue Adapter
- [`@mqueue/kafkajs`][]: Kafka Queue Adapter
- [`@mqueue/stompjs`][]: STOMP Queue Adapter

## Broadcast Strategies

- [`@mqueue/multicast`][]: Multi-queue simultaneous publishing/consumption
  strategy

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
  https://github.com/domwebber/mqueue/blob/main/packages/kafka/README.md
[`@mqueue/stompjs`]:
  https://github.com/domwebber/mqueue/blob/main/packages/stompjs/README.md
[`@mqueue/fastq`]:
  https://github.com/domwebber/mqueue/blob/main/packages/fastq/README.md
[`@mqueue/multicast`]:
  https://github.com/domwebber/mqueue/blob/main/packages/multicast/README.md

## Compatibility

[Why might you need a Message Queue?](https://blog.bytebytego.com/p/why-do-we-need-a-message-queue)

- **NodeJS** v18+, tested on v22+

| Queue Platform                                | Queue Adapter                   |
| --------------------------------------------- | ------------------------------- |
| Apache ActiveMQ (AMQP v1.0)                   | [`@mqueue/rhea`][]              |
| Apache ActiveMQ (MQTT)                        | [`@mqueue/mqtt`][]              |
| Apache ActiveMQ (STOMP)                       | [`@mqueue/stompjs`][]           |
| Apache Kafka                                  | [`@mqueue/kafkajs`][]           |
| AWS Simple Queue Service (SQS)                | [`@mqueue/sqs`][]               |
| Azure Service Bus                             | [`@mqueue/azure-service-bus`][] |
| Azure Service Bus (AMQP v1.0)                 | [`@mqueue/rhea`][]              |
| Eclipe Mosquitto                              | [`@mqueue/mqtt`][]              |
| ElasticMQ (SQS-Compatible)                    | [`@mqueue/sqs`][]               |
| Fastq                                         | [`@mqueue/fastq`][]             |
| RabbitMQ (AMQP v0.9.1)                        | [`@mqueue/amqplib`][]           |
| RabbitMQ (AMQP v1.0 or with AMQP v1.0 Plugin) | [`@mqueue/rhea`][]              |
| RabbitMQ (with MQTT Plugin)                   | [`@mqueue/mqtt`][]              |
| RabbitMQ (with STOMP Plugin)                  | [`@mqueue/stompjs`][]           |

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
[`@mqueue/multicast`]:
  https://github.com/domwebber/mqueue/blob/main/packages/multicast/README.md
