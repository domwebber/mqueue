# @mqueue/pubsub

## 1.0.3

### Patch Changes

- [`033491f`](https://github.com/domwebber/mqueue/commit/033491f122654908d2adcc361966ca4d78f00697)
  Thanks [@domwebber](https://github.com/domwebber)! - Move `typescript` and
  `tsx` to monorepo root, out of installed-package dependencies

- [`e242a16`](https://github.com/domwebber/mqueue/commit/e242a167b93b484b28c5818ea06985b106d4c20e)
  Thanks [@domwebber](https://github.com/domwebber)! - Move `publint` to
  monorepo root, out of installed-package dependencies

- [`6d95fb4`](https://github.com/domwebber/mqueue/commit/6d95fb4424014998b74dc8d1add625e4b0be6051)
  Thanks [@domwebber](https://github.com/domwebber)! - Move `testcontainers` to
  monorepo root, out of installed-package dependencies

- [`c002052`](https://github.com/domwebber/mqueue/commit/c0020521cd56c296f084f65a3f774792d2b70a27)
  Thanks [@domwebber](https://github.com/domwebber)! - Update various
  dependencies

- [`c002052`](https://github.com/domwebber/mqueue/commit/c0020521cd56c296f084f65a3f774792d2b70a27)
  Thanks [@domwebber](https://github.com/domwebber)! - Updated TypeScript to
  `v6`

- [`85cb3d9`](https://github.com/domwebber/mqueue/commit/85cb3d945539691292f3ecf624eaed618e64d65c)
  Thanks [@domwebber](https://github.com/domwebber)! - Migrate bundling to
  `tsdown` (Rolldown)

- Updated dependencies
  [[`033491f`](https://github.com/domwebber/mqueue/commit/033491f122654908d2adcc361966ca4d78f00697),
  [`e242a16`](https://github.com/domwebber/mqueue/commit/e242a167b93b484b28c5818ea06985b106d4c20e),
  [`6d95fb4`](https://github.com/domwebber/mqueue/commit/6d95fb4424014998b74dc8d1add625e4b0be6051),
  [`c002052`](https://github.com/domwebber/mqueue/commit/c0020521cd56c296f084f65a3f774792d2b70a27),
  [`c002052`](https://github.com/domwebber/mqueue/commit/c0020521cd56c296f084f65a3f774792d2b70a27),
  [`85cb3d9`](https://github.com/domwebber/mqueue/commit/85cb3d945539691292f3ecf624eaed618e64d65c)]:
  - @mqueue/queue@1.0.2

## 1.0.2

### Patch Changes

- [`505501d`](https://github.com/domwebber/mqueue/commit/505501db28a292c8538998e988e542ac984cfbbb)
  Thanks [@domwebber](https://github.com/domwebber)! - Update dependencies:
  - testcontainers
  - tsx
  - typescript

- Updated dependencies
  [[`505501d`](https://github.com/domwebber/mqueue/commit/505501db28a292c8538998e988e542ac984cfbbb)]:
  - @mqueue/queue@1.0.1

## 1.0.1

### Patch Changes

- [`1158d95`](https://github.com/domwebber/mqueue/commit/1158d950bcd174d82056f96c12f624f27a72c078)
  Thanks [@domwebber](https://github.com/domwebber)! - Update
  `@google-cloud/pubsub` to `v5.2.0`

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

- [`a7d4822`](https://github.com/domwebber/mqueue/commit/a7d48229196a93ebf033975a08d327992ba5addf)
  Thanks [@domwebber](https://github.com/domwebber)! - Add Google Cloud Pub/Sub
  MQueue Adapter

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
