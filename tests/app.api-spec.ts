import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupMongoMemoryReplSet, setupNestApp } from './api-utils';
import { getMongoToken } from '@golee/mongo-nest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

describe('AppController (api)', () => {
    let app: INestApplication;
    let mongodb: MongoMemoryReplSet;
    let mongoClient: MongoClient;

    beforeAll(async () => {
        mongodb = await setupMongoMemoryReplSet();
        app = await setupNestApp(mongodb);

        mongoClient = app.get(getMongoToken());
    });

    afterEach(async () => {
        await mongoClient.db().dropDatabase();
    });

    afterAll(async () => {
        await app.close();
        await mongodb.stop();
    });

    describe('/health', () => {
        it('should return ok', async () => {
            const response = await request(app.getHttpServer()).get('/health').send();
            expect(response.statusCode).toBe(200);
        });
    });
});
