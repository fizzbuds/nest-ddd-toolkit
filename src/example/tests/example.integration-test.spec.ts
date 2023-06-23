import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ExampleAggregateRoot } from '../domain';
import { MongoRepo } from '../../common';
import { ExampleMongoSerializerDeserializer, ExampleWriteModel } from '../infrastructure';
import { ExampleCommands } from '../example.commands';

describe('Example integration', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let mongoRepo: MongoRepo<ExampleAggregateRoot, ExampleWriteModel>;
    let commands: ExampleCommands;

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
                    useFactory: (mongoConn: Connection) => {
                        return new MongoRepo<ExampleAggregateRoot, ExampleWriteModel>(
                            new ExampleMongoSerializerDeserializer(),
                            mongoConn,
                            'example_write_model',
                        );
                    },
                    inject: [getConnectionToken()],
                },
                ExampleCommands,
            ],
            imports: [MongooseModule.forRoot(mongodb.getUri('test'))],
        }).compile();

        mongoRepo = module.get<MongoRepo<ExampleAggregateRoot, ExampleWriteModel>>('MongoExampleRepo');
        commands = module.get<ExampleCommands>(ExampleCommands);
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('When create example', () => {
        it('should save write model', async () => {
            const { exampleId } = await commands.createCmd();

            expect(await mongoRepo.getById(exampleId)).toBeDefined();
        });
    });
});
