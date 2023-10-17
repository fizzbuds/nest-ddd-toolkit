import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ExampleAggregateRoot } from '../domain';
import { GenericId, MongoAggregateRepo } from '../../common';
import { ExampleAggregateModel, ExampleMongoSerializer, ExampleQueryRepo, ExampleRepoHooks } from '../infrastructure';
import { ExampleCommands } from '../example.commands';
import { ExampleQueries } from '../example.queries';
import { exampleMongoWriteRepoToken } from '../example.module';
import { ExampleId } from '../domain/example-id';
import { Db } from 'mongodb';
import { Connection } from 'mongoose';

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
                    provide: ExampleQueryRepo,
                    inject: [getConnectionToken()],
                    useFactory: (db: Db) => {
                        return new ExampleQueryRepo(db, 'example_read_model');
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
        describe('Given a created aggregate', () => {
            let exampleId: ExampleId;

            beforeEach(async () => {
                exampleId = await commands.createCmd();
            });

            describe('When getting from db the aggregate', () => {
                it('should return an aggregate with version 1', async () => {
                    expect(await aggregateRepo.getById(exampleId)).toMatchObject({ __version: 1 });
                });
            });

            describe('When creating a new instance with the same id', () => {
                it('should throw due to unique index on id', async () => {
                    const newAggregate = new ExampleAggregateRoot(exampleId);
                    await expect(async () => await aggregateRepo.save(newAggregate)).rejects.toThrowError(
                        'duplicated id',
                    );
                });
            });

            describe('When saving an aggregate with undefined __version', () => {
                it('should throw due to optimistic locking', async () => {
                    const aggregate = await aggregateRepo.getById(exampleId);
                    if (aggregate === null) throw new Error('Example not found');
                    aggregate.addName('Foo');
                    aggregate.__version = undefined!;

                    await expect(async () => await aggregateRepo.save(aggregate)).rejects.toThrowError(
                        'optimistic locking',
                    );
                });
            });

            describe('When multiple saved aggregate changes', () => {
                it('should increase the aggregate version', async () => {
                    const firstInstance = await aggregateRepo.getById(exampleId);
                    if (firstInstance === null) throw new Error('Example not found');
                    firstInstance.addName('Foo');
                    await aggregateRepo.save(firstInstance);

                    const secondInstance = await aggregateRepo.getById(exampleId);
                    if (secondInstance === null) throw new Error('Example not found');
                    secondInstance.addName('Bar');
                    await aggregateRepo.save(secondInstance);

                    const thirdInstance = await aggregateRepo.getById(exampleId);
                    if (thirdInstance === null) throw new Error('Example not found');
                    expect(thirdInstance).toMatchObject({ __version: 3 });
                });
            });

            describe('When saving an outdated aggregate', () => {
                it('should throw an optimistic locking error', async () => {
                    const firstInstance = await aggregateRepo.getById(exampleId);
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
});
