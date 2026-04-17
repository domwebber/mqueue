# mqueue (Multi-Queue)

[![npm (scoped)][]][sdk-npmjs]

Simple queue interface with support for multiple backends. Keep your options
open.

> [Make a contribution](./CONTRIBUTING.md).

## Getting Started

To learn how to use MQueue, check out the [`@mqueue/queue`][] README. To learn
how to use a specific queue adapter, check out the README for that adapter under
[Queue Adapters](#queue-adapters).

For queue and transport compatibility, see the compatibility table in the
[`@mqueue/queue`][] README.

```ts
import MQueue from "@mqueue/queue";
// const MQueue = require("@mqueue/queue");

const outgoingQueue = new MQueue.Outgoing(
  await AmqplibOutgoingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
);

outgoingQueue.sendMessage({
  headers: { "Account-ID": "123" },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await AmqplibIncomingQueue.connect("amqp://rabbitmq:5271", "queue-name"),
);
```

> For more usage examples, see the
> [`@mqueue/queue` readme](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md#examples).

## Packages

- [`@mqueue/queue`][]: Simple queue interface with support for multiple backends

## Queue Adapters

- [`@mqueue/amqplib`][]: AMQP v0.9.1 queue adapter
- [`@mqueue/sqs`][]: AWS Simple Queue Service (SQS) queue adapter
- [`@mqueue/rhea`][]: AMQP v1.0 queue adapter
- [`@mqueue/azure-service-bus`][]: Azure Service Bus queue adapter
- [`@mqueue/google-cloud-pubsub`][]: Google Cloud Pub/Sub
- [`@mqueue/mqtt`][]: MQTT Queue Adapter
- [`@mqueue/kafkajs`][]: Kafka Queue Adapter
- [`@mqueue/stompjs`][]: STOMP Queue Adapter
- [`@mqueue/fastq`][]: Fastq In-Memory Queue Adapter

## Broadcast Strategies

- [`@mqueue/multicast`][]: Multi-queue simultaneous publishing/consumption
  strategy

## Credit

This package was inspired by [Keyv](https://github.com/jaredwray/keyv),
[Flystorage](https://github.com/duna-oss/flystorage), and
[Flysystem](https://flysystem.thephpleague.com).

The concept for this package was to create the
[Keyv](https://github.com/jaredwray/keyv) for Queue backends - simply
abstracting the interface for different queue backends to remain flexible and
keep options open.

## License

[MIT © Dom Webber](https://github.com/domwebber/mqueue/blob/main/LICENSE)

https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md

https://github.com/domwebber/mqueue/blob/main/packages/amqplib/README.md

https://github.com/domwebber/mqueue/blob/main/packages/sqs/README.md

https://github.com/domwebber/mqueue/blob/main/packages/rhea/README.md

https://github.com/domwebber/mqueue/blob/main/packages/azure-service-bus/README.md

https://github.com/domwebber/mqueue/blob/main/packages/mqtt/README.md

https://github.com/domwebber/mqueue/blob/main/packages/kafkajs/README.md

https://github.com/domwebber/mqueue/blob/main/packages/stompjs/README.md

https://github.com/domwebber/mqueue/blob/main/packages/fastq/README.md

https://github.com/domwebber/mqueue/blob/main/packages/google-cloud-pubsub/README.md

https://github.com/domwebber/mqueue/blob/main/packages/multicast/README.md

[`@mqueue/amqplib`]: [`@mqueue/azure-service-bus`]: [`@mqueue/fastq`]:
[`@mqueue/google-cloud-pubsub`]: [`@mqueue/kafkajs`]: [`@mqueue/mqtt`]:
[`@mqueue/multicast`]: [`@mqueue/queue`]: [`@mqueue/rhea`]: [`@mqueue/sqs`]:
[`@mqueue/stompjs`]: [npm (scoped)]:
https://img.shields.io/npm/v/%40mqueue/queue [sdk-npmjs]:
https://www.npmjs.com/package/@mqueue/queue
