# mqueue (Multi-Queue)

Simple queue interface with support for multiple backends. Keep your options
open.

> Note: This project is currently a Work in Progress. Its not ready for
> production use yet - [make a contribution](./CONTRIBUTING.md).

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

## Getting Started

To learn how to use MQueue, check out the [`@mqueue/queue`][] README. To learn
how to use a specific queue adapter, check out the README for that adapter under
[Queue Adapters](#queue-adapters).

## Packages

- [`@mqueue/queue`][]: Simple queue interface with support for multiple backends

## Queue Adapters

- [`@mqueue/amqplib`][]: AMQP v0.9.1 queue adapter
- [`@mqueue/sqs`][]: AWS Simple Queue Service (SQS) queue adapter
- [`@mqueue/rhea`][]: AMQP v1.0 queue adapter
- [`@mqueue/azure-service-bus`][]: Azure Service Bus queue adapter
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

| Queue Platform                                | Queue Adapter                   |
| --------------------------------------------- | ------------------------------- |
| Apache ActiveMQ (AMQP v1.0)                   | [`@mqueue/rhea`][]              |
| Apache ActiveMQ (MQTT)                        | [`@mqueue/mqtt`][]              |
| Apache ActiveMQ (STOMP)                       | [`@mqueue/stompjs`][]           |
| Apache Kafka                                  | [`@mqueue/kafkajs`][]           |
| AWS Simple Queue Service (SQS)                | [`@mqueue/sqs`][]               |
| Azure Service Bus                             | [`@mqueue/azure-service-bus`][] |
| Azure Service Bus (AMQP v1.0) [^1]            | [`@mqueue/rhea`][]              |
| Eclipe Mosquitto                              | [`@mqueue/mqtt`][]              |
| ElasticMQ (SQS-Compatible)                    | [`@mqueue/sqs`][]               |
| Fastq                                         | [`@mqueue/fastq`][]             |
| RabbitMQ (AMQP v0.9.1)                        | [`@mqueue/amqplib`][]           |
| RabbitMQ (AMQP v1.0 or with AMQP v1.0 Plugin) | [`@mqueue/rhea`][]              |
| RabbitMQ (with MQTT Plugin)                   | [`@mqueue/mqtt`][]              |
| RabbitMQ (with STOMP Plugin)                  | [`@mqueue/stompjs`][]           |

[^1]:
    Better authentication integration may be achieved with Azure Service bus by
    using [`@mqueue/azure-service-bus`][] instead of [`@mqueue/rhea`][].

## Credit

This package was inspired by [Keyv](https://github.com/jaredwray/keyv),
[Flystorage](https://github.com/duna-oss/flystorage), and
[Flysystem](https://flysystem.thephpleague.com).

The concept for this package was to create the
[Keyv](https://github.com/jaredwray/keyv) for Queue backends - simply
abstracting the interface for different queue backends to remain flexible and
keep options open.

## License

[MIT © Dom Webber](./LICENSE)

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
