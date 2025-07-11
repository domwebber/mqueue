# Dead-end (Null) Adapter for MQueue

A queue adapter for
[MQueue](https://github.com/domwebber/mqueue/blob/main/packages/queue/README.md)
that goes nowhere - primarily intended for internal and testing purposes.

```bash
npm install --save @mqueue/queue @mqueue/null
# or use pnpm/yarn
```

```ts
const outgoingQueue = new MQueue.Outgoing(new NullQueue.Outgoing());

outgoingQueue.sendMessage({
  headers: {
    "Account-ID": "123",
  },
  body: "...",
});

// ...

const incomingQueue = new MQueue.Incoming(new NullQueue.Incoming());
```
