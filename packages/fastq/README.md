# fastq for MQueue

An [fastq](https://github.com/mcollina/fastq) adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md),
adding support for fastq queues with a multi-backend setup with MQueue.

```bash
npm install --save @mqueue/queue @mqueue/fastq
# or use pnpm/yarn
```

```ts
const fastq = new FastqQueue.Outgoing();
const outgoingQueue = new MQueue.Outgoing(fastq);

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(
  new FastqQueue.Incoming(fastq),
);
```

## Compatibility

- Single-Node NodeJS Applications
