import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ExampleAggregateRoot } from '../domain';
import { MongoRepo } from '../../common';
import { ExampleMongoSerializerDeserializer, ExampleWriteModel } from '../infrastructure';
import { ExampleCommands } from '../example.commands';
import { ExampleRepoHooks } from '../infrastructure/repo-hooks';
import { ExampleReadModelRepo } from '../infrastructure/read-model-repo';
import { ExampleQueries } from '../example.queries';

describe('Example integration', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commands: ExampleCommands;
    let queries: ExampleQueries;

    beforeAll(async () => {
        mongodb = await MongoMemoryReplSet.create({
            replSet: {
                count: 1,
                dbName: 'test',
                storageEngine: 'wiredTiger',
            },
        });

        module = await Test.createTestingModule({
            providers: [
                {
                    provide: 'MongoExampleRepo',
                    useFactory: (mongoConn: Connection, exampleRepoHooks: ExampleRepoHooks) => {
                        return new MongoRepo<ExampleAggregateRoot, ExampleWriteModel>(
                            new ExampleMongoSerializerDeserializer(),
                            mongoConn,
                            'example_write_model',
                            exampleRepoHooks,
                        );
                    },
                    inject: [getConnectionToken(), ExampleRepoHooks],
                },
                ExampleCommands,
                ExampleRepoHooks,
                ExampleReadModelRepo,
                ExampleQueries,
            ],
            imports: [MongooseModule.forRoot(mongodb.getUri('test'))],
        }).compile();

        commands = module.get<ExampleCommands>(ExampleCommands);
        queries = module.get<ExampleQueries>(ExampleQueries);
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('When create example', () => {
        it('should be saved into read model', async () => {
            const { exampleId } = await commands.createCmd();

            expect(await queries.getOneExampleQuery(exampleId)).toBeDefined();
        });
    });

    describe('Given a created example', () => {
        let exampleId: string;

        beforeEach(async () => {
            const { exampleId: _exampleId } = await commands.createCmd();
            exampleId = _exampleId;
        });

        describe('When add-name', () => {
            it('should save name into read model', async () => {
                await commands.addNameCmd(exampleId, 'Foo');

                expect(await queries.getOneExampleQuery(exampleId)).toMatchObject({ name: 'Foo' });
            });
        });
    });
});
