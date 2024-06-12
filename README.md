## Installation

```bash
$ pnpm install
```

## MongoDB in memory

```bash
$ pnpm exec ts-node mongo-memory-repl-set.ts
``` 

## Running the app

Make sure MongoDB is up and running.

```bash
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## Test

Tests don't need a running MongoDB instance, they use an in memory database.

```bash
# unit and component tests
$ pnpm run test

# api tests
$ pnpm run test:api
```