import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { getMongoToken } from '@golee/mongo-nest';
import { createMember, setupMongoMemoryReplSet, setupNestApp } from './api-utils';

describe('Registration (api)', () => {
    let mongodb: MongoMemoryReplSet;
    let mongoClient: MongoClient;
    let app: INestApplication;

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

    describe('/members', () => {
        describe('POST /members', () => {
            it('should create a new member', async () => {
                const response = await request(app.getHttpServer()).post('/members/').send({ name: 'John Doe' });
                expect(response.body).toMatchObject({ id: expect.any(String) });
                expect(response.statusCode).toBe(201);
            });
        });

        describe('GET /members/:id', () => {
            it('should return the member data', async () => {
                const memberId = await createMember(app);
                const response = await request(app.getHttpServer()).get(`/members/${memberId}`);
                expect(response.body.name).toBe('John Doe');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('DELETE /members/:id', () => {
            it('should delete the member', async () => {
                const memberId = await createMember(app);
                const deleteResponse = await request(app.getHttpServer()).delete(`/members/${memberId}`);
                expect(deleteResponse.statusCode).toBe(200);
                const getResponse = await request(app.getHttpServer()).get(`/members/${memberId}`);
                expect(getResponse.statusCode).toBe(404);
            });
        });
    });
});
