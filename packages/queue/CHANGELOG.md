# @mqueue/queue

## 0.0.8

### Patch Changes

- d72234a: Add options to IncomingQueue and OutgoingQueue constructors
- d4b9c7c: Add `SignatureHashHook` preset hook for adding and verifying digital
  signatures.

  ```ts
  const outgoingQueue = new MQueue.Outgoing(adapter, {
    onSend: [SignatureHashHook.outgoing()],
  });

  const incomingQueue = new MQueue.Incoming(adapter, {
    onReceipt: [SignatureHashHook.incoming()],
  });
  ```

## 0.0.7

### Patch Changes

- 9a0d81f: Add repository information to package.json
- 7a8b670: Allow public access to MQueue.{Incoming,Outgoing}.adapter

## 0.0.6

### Patch Changes

- 1c61ee5: Export MQueue as a default and named export

## 0.0.5

### Patch Changes

- a2d599c: Export `IncomingQueue` and `OutgoingQueue` classes

## 0.0.4

### Patch Changes

- fd0f800: Add missing build files

## 0.0.3

### Patch Changes

- d5bd9d9: Add event listeners to allow an option for Observer pattern usage
- 9c52437: Add queue/topic/transport name to consumption parameters
- 8b41c9f: Add integration testing

## 0.0.2

### Patch Changes

- 4118a3c: Update publishing
