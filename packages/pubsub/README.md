# @google-cloud/pubsub for MQueue

An [Google Cloud Pub-Sub](https://npmjs.com/package/@google-cloud/pubsub)
adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for Google Cloud Pub/Sub with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/pubsub
# or use pnpm/yarn
```

```ts
const outgoingQueue = new MQueue.Outgoing(
  await PubSubQueue.Outgoing.connect(...),
);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  await PubSubQueue.Incoming.connect(...),
);
```

## Compatibility

- [Google Cloud Pub/Sub](https://cloud.google.com/pubsub)

## License

[MIT © Dom Webber](./LICENSE)
