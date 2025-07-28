# @mqueue/queue

## 1.0.0

### Major Changes

- [`5b0192f`](https://github.com/domwebber/mqueue/commit/5b0192faee2b6a77db7a4b4806e2407ab72cf940)
  Thanks [@domwebber](https://github.com/domwebber)! - Reduce bundle size by
  removing CJS build. NodeJS v20.19.0 and above allow
  [`require()` for ESM](https://github.com/nodejs/node/releases/tag/v20.19.0) -
  consumers in a CJS environment should still be able to use the library as
  before, with the current latest LTS NodeJS version.

  This update coincides with dropping support for EOL NodeJS v18, thus the
  minimum supported NodeJS version is now v20.

- [`5b0192f`](https://github.com/domwebber/mqueue/commit/5b0192faee2b6a77db7a4b4806e2407ab72cf940)
  Thanks [@domwebber](https://github.com/domwebber)! - Increase minimum NodeJS
  version to latest LTS (v20.x)

### Minor Changes

- [`90a29bd`](https://github.com/domwebber/mqueue/commit/90a29bd5f46640dfcf01a9309e027e3d0ccf45b4)
  Thanks [@domwebber](https://github.com/domwebber)! - Add `QueueMessage.json()`
  and `QueueMessage.text()` helper methods

- [`041e012`](https://github.com/domwebber/mqueue/commit/041e0127248ae0dc6e414319e5f0cdd0800e49ea)
  Thanks [@domwebber](https://github.com/domwebber)! - Remove internal array
  splitting in favour of in-application-code splitting where needed

- [`3dfb308`](https://github.com/domwebber/mqueue/commit/3dfb308bb3eb45e9a069cecc2dd22bfe495f9f88)
  Thanks [@domwebber](https://github.com/domwebber)! - Add JSON body pre-send
  formatting support

### Patch Changes

- [`1dce289`](https://github.com/domwebber/mqueue/commit/1dce289316acbda48288efd20c103457f461d1fa)
  Thanks [@domwebber](https://github.com/domwebber)! - Update README to add
  digital signature example

- [`d9376c3`](https://github.com/domwebber/mqueue/commit/d9376c314316082d4c53c1e2be229c163ff2509b)
  Thanks [@domwebber](https://github.com/domwebber)! - Add JSDocs

## 0.0.9

### Patch Changes

- bbe6b6f: Update tsconfig files

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
