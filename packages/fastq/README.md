# fastq for MQueue

A [fastq](https://github.com/mcollina/fastq) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for fastq queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/fastq
# or use pnpm/yarn
```

```ts
const incomingQueue = new FastqQueue.Incoming(1);
const outgoingQueue = new FastqQueue.Outgoing(incomingQueue.queue);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

await incomingQueue.consume(async (payload) => {
  // ...
});
```

## Compatibility

- Single-Node NodeJS Applications

## License

[MIT © Dom Webber](./LICENSE)
