export const mongoExampleRepoToken = 'MongoExampleRepo';

import { Module } from '@nestjs/common';
import { ExampleController } from './api/example.controller';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { ExampleMongoSerializerDeserializer, ExampleWriteModel } from './infrastructure';
import { ExampleCommands } from './example.commands';
import { MongoRepo } from '../common';
import { ExampleAggregateRoot } from './domain';

@Module({
    controllers: [ExampleController],
    providers: [
        ExampleCommands,
        {
            provide: mongoExampleRepoToken,
            useFactory: (conn: Connection) => {
                return new MongoRepo<ExampleAggregateRoot, ExampleWriteModel>(
                    new ExampleMongoSerializerDeserializer(),
                    conn,
                    'example_write_model',
                );
            },
            inject: [getConnectionToken()],
        },
    ],
})
export class ExampleModule {}
