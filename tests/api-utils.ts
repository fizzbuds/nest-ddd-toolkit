import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export const setupMongoMemoryReplSet = async () => {
    return await MongoMemoryReplSet.create({
        replSet: {
            count: 1,
            dbName: 'test',
            storageEngine: 'wiredTiger',
        },
    });
};

export const setupNestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
};

export const createMember = async (app: INestApplication) => {
    const { body } = await request(app.getHttpServer()).post('/members/').send({ name: 'John Doe' });
    return body.id;
};
