import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

export const setupMongoMemoryReplSet = async () => {
    return await MongoMemoryReplSet.create({
        replSet: {
            count: 1,
            dbName: 'test',
            storageEngine: 'wiredTiger',
        },
    });
};

export const setupNestApp = async (mongodb: MongoMemoryReplSet) => {
    const fakeConfig: Record<string, any> = {
        MONGODB_URI: mongodb.getUri(),
        LOG_LEVEL: 'debug',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(ConfigService)
        .useValue({ get: (key: string) => fakeConfig[key], getOrThrow: (key: string) => fakeConfig[key] })
        .compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
};

export const createMember = async (app: INestApplication) => {
    const { body } = await request(app.getHttpServer()).post('/members/').send({ name: 'John Doe' });
    return body.id;
};
