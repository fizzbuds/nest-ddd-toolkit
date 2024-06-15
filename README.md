## Run the environment without installing

1. Fork the repository
2. Register to [gitpod.io](https://gitpod.io/)
3. Give access to your GitHub account
4. Create a New Workspace on gitpod selecting the forked repo
5. Open vscode in browser or connect to your IDE

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
