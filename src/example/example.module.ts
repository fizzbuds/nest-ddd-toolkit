export const exampleMongoWriteRepoToken = 'ExampleMongoWriteRepoToken'; // This variable must be defined before imports
import { ExampleQueries } from './example.queries';
import { ExampleAggregateModel, ExampleMongoSerializer, ExampleQueryRepo, ExampleRepoHooks } from './infrastructure';
import { Module } from '@nestjs/common';
import { ExampleController } from './api/example.controller';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { ExampleCommands } from './example.commands';
import { MongoAggregateRepo } from '../common';
import { ExampleAggregateRoot } from './domain';

@Module({
    controllers: [ExampleController],
    providers: [
        ExampleCommands,
        ExampleRepoHooks,
        ExampleQueries,
        {
            provide: exampleMongoWriteRepoToken,
            inject: [getConnectionToken(), ExampleRepoHooks],
            useFactory: (conn: Connection, exampleRepoHooks: ExampleRepoHooks) => {
                return new MongoAggregateRepo<ExampleAggregateRoot, ExampleAggregateModel>(
                    new ExampleMongoSerializer(),
                    conn.getClient(),
                    'example_write_model',
                    exampleRepoHooks,
                );
            },
        },
        {
            provide: ExampleQueryRepo,
            inject: [getConnectionToken()],
            useFactory: (conn: Connection) => {
                return new ExampleQueryRepo(conn.getClient(), 'example_read_model');
            },
        },
    ],
})
export class ExampleModule {}
