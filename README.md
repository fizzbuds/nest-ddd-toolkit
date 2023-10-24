## Refactoring with CQRS slides

[Refactoring with CQRS (without events).pdf](./Refactoring%20with%20CQRS%20(without%20events).pdf)


## Installation

```bash
$ pnpm install
```

## Local MongoDB

```bash
$ docker run --name mongodb -p 27017:27017 -d mongo
``` 

## Running the app
Make sure docker is running and the local MongoDB is up and running.

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test
Tests don't need a running MongoDB instance, they use an in memory database.

```bash
# unit and component tests
$ pnpm run tests

# api tests
$ pnpm run tests:api

# integration tests
$ pnpm run tests:integration

# tests coverage
$ pnpm run tests:cov
```