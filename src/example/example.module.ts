export const mongoExampleRepoToken = 'MongoExampleRepo';
import { ExampleQueries } from './example.queries';
import {
    ExampleMongoSerializerDeserializer,
    ExampleReadModelRepo,
    ExampleRepoHooks,
    ExampleWriteModel,
} from './infrastructure';
import { Module } from '@nestjs/common';
import { ExampleController } from './api/example.controller';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { ExampleCommands } from './example.commands';
import { MongoRepo } from '../common';
import { ExampleAggregateRoot } from './domain';

@Module({
    controllers: [ExampleController],
    providers: [
        ExampleCommands,
        ExampleRepoHooks,
        ExampleReadModelRepo,
        ExampleQueries,
        {
            provide: mongoExampleRepoToken,
            useFactory: (conn: Connection, exampleRepoHooks: ExampleRepoHooks) => {
                return new MongoRepo<ExampleAggregateRoot, ExampleWriteModel>(
                    new ExampleMongoSerializerDeserializer(),
                    conn,
                    'example_write_model',
                    exampleRepoHooks,
                );
            },
            inject: [getConnectionToken(), ExampleRepoHooks],
        },
    ],
})
export class ExampleModule {}
