import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ExampleAggregateRoot } from '../domain';
import { GenericId, MongoAggregateRepo } from '../../common';
import { ExampleAggregateModel, ExampleMongoSerializer, ExampleReadRepo, ExampleRepoHooks } from '../infrastructure';
import { ExampleCommands } from '../example.commands';
import { ExampleQueries } from '../example.queries';
import { exampleMongoWriteRepoToken } from '../example.module';
import { ExampleId } from '../domain/example-id';

describe('Example Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commands: ExampleCommands;
    let queries: ExampleQueries;
    let aggregateRepo: MongoAggregateRepo<ExampleAggregateRoot, ExampleAggregateModel>;

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
                    provide: exampleMongoWriteRepoToken,
                    useFactory: (mongoConn: Connection, exampleRepoHooks: ExampleRepoHooks) => {
                        return new MongoAggregateRepo<ExampleAggregateRoot, ExampleAggregateModel>(
                            new ExampleMongoSerializer(),
                            mongoConn,
                            'example_write_model',
                            exampleRepoHooks,
                        );
                    },
                    inject: [getConnectionToken(), ExampleRepoHooks],
                },
                ExampleCommands,
                ExampleRepoHooks,
                {
                    provide: ExampleReadRepo,
                    inject: [getConnectionToken()],
                    useFactory: (conn: Connection) => {
                        return new ExampleReadRepo(conn, 'example_read_model');
                    },
                },
                ExampleQueries,
            ],
            imports: [MongooseModule.forRoot(mongodb.getUri('test'))],
        }).compile();

        commands = module.get<ExampleCommands>(ExampleCommands);
        queries = module.get<ExampleQueries>(ExampleQueries);
        aggregateRepo =
            module.get<MongoAggregateRepo<ExampleAggregateRoot, ExampleAggregateModel>>(exampleMongoWriteRepoToken);
        await aggregateRepo.onModuleInit();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('When create example', () => {
        let exampleId: ExampleId;
        beforeEach(async () => {
            exampleId = await commands.createCmd();
        });

        it('should be saved into write model', async () => {
            expect(await aggregateRepo.getById(exampleId)).toBeDefined();
        });
        it('should be saved into read model', async () => {
            expect(await queries.getOneExampleQuery(exampleId.toString())).toBeDefined();
        });
    });

    describe('Given a created example', () => {
        let exampleId: ExampleId;

        beforeEach(async () => {
            exampleId = await commands.createCmd();
        });

        describe('When add-name', () => {
            it('should save name into read model', async () => {
                await commands.addNameCmd(exampleId as unknown as GenericId, 'Foo');

                expect(await queries.getOneExampleQuery(exampleId.toString())).toMatchObject({ name: 'Foo' });
            });
        });
    });

    describe('Optimistic Lock', () => {
        let exampleId: ExampleId;

        beforeEach(async () => {
            exampleId = await commands.createCmd();
        });

        describe('Given a created example', () => {
            it('should throw when save with old version', async () => {
                const firstInstance = await aggregateRepo.getById(exampleId);
                // TODO evaluate to implement getOrThrow
                if (firstInstance === null) throw new Error('Example not found');
                firstInstance.addName('Foo');

                const secondInstance = await aggregateRepo.getById(exampleId);
                if (secondInstance === null) throw new Error('Example not found');
                secondInstance.addName('Bar');
                await aggregateRepo.save(secondInstance);

                await expect(async () => await aggregateRepo.save(firstInstance)).rejects.toThrowError(
                    'optimistic locking',
                );
            });
        });
    });
});
