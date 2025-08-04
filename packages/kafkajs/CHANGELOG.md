# @mqueue/kafkajs

## 1.0.1

### Patch Changes

- [`b099ec1`](https://github.com/domwebber/mqueue/commit/b099ec1b1d503b805cc4d202d2da7e2d164c4acb)
  Thanks [@domwebber](https://github.com/domwebber)! - Move
  `@testcontainers/kafka` to devDependencies and update to `v11.5.0`

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

### Patch Changes

- Updated dependencies
  [[`90a29bd`](https://github.com/domwebber/mqueue/commit/90a29bd5f46640dfcf01a9309e027e3d0ccf45b4),
  [`041e012`](https://github.com/domwebber/mqueue/commit/041e0127248ae0dc6e414319e5f0cdd0800e49ea),
  [`5b0192f`](https://github.com/domwebber/mqueue/commit/5b0192faee2b6a77db7a4b4806e2407ab72cf940),
  [`1dce289`](https://github.com/domwebber/mqueue/commit/1dce289316acbda48288efd20c103457f461d1fa),
  [`d9376c3`](https://github.com/domwebber/mqueue/commit/d9376c314316082d4c53c1e2be229c163ff2509b),
  [`5b0192f`](https://github.com/domwebber/mqueue/commit/5b0192faee2b6a77db7a4b4806e2407ab72cf940),
  [`3dfb308`](https://github.com/domwebber/mqueue/commit/3dfb308bb3eb45e9a069cecc2dd22bfe495f9f88)]:
  - @mqueue/queue@1.0.0

## 0.0.9

### Patch Changes

- bbe6b6f: Update tsconfig files
- dca71b7: Export `*IncomingQueue` and `*OutgoingQueue` types
- Updated dependencies [bbe6b6f]
  - @mqueue/queue@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies [d72234a]
- Updated dependencies [d4b9c7c]
  - @mqueue/queue@0.0.8

## 0.0.7

### Patch Changes

- 9a0d81f: Add repository information to package.json
- Updated dependencies [9a0d81f]
- Updated dependencies [7a8b670]
  - @mqueue/queue@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies [1c61ee5]
  - @mqueue/queue@0.0.6

## 0.0.5

### Patch Changes

- Updated dependencies [a2d599c]
  - @mqueue/queue@0.0.5

## 0.0.4

### Patch Changes

- fd0f800: Add missing build files
- Updated dependencies [fd0f800]
  - @mqueue/queue@0.0.4

## 0.0.3

### Patch Changes

- 9c52437: Add queue/topic/transport name to consumption parameters
- 8b41c9f: Add integration testing
- Updated dependencies [d5bd9d9]
- Updated dependencies [9c52437]
- Updated dependencies [8b41c9f]
  - @mqueue/queue@0.0.3

## 0.0.2

### Patch Changes

- 4118a3c: Update publishing
- Updated dependencies [4118a3c]
  - @mqueue/queue@0.0.2
