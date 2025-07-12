---
"@mqueue/queue": patch
---

Add `SignatureHashHook` preset hook for adding and verifying digital signatures.

```ts
const outgoingQueue = new MQueue.Outgoing(adapter, {
  onSend: [SignatureHashHook.outgoing()],
});

const incomingQueue = new MQueue.Incoming(adapter, {
  onReceipt: [SignatureHashHook.incoming()],
});
```
