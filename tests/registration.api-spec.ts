import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { getMongoToken } from '@golee/mongo-nest';

export async function createMember(app: INestApplication) {
    const response = await request(app.getHttpServer()).post('/members/').send({ name: 'John Doe' });
    return response.body.id;
}

describe('Registration (api)', () => {
    let mongodb: MongoMemoryReplSet;
    let mongoClient: MongoClient;
    let app: INestApplication;

    class ConfigServiceFake {
        get(key: string) {
            switch (key) {
                case 'MONGODB_URI':
                    return mongodb.getUri('test');
                case 'LOG_LEVEL':
                    return 'debug';
                default:
                    return '';
            }
        }

        getOrThrow(key: string) {
            return this.get(key);
        }
    }

    beforeAll(async () => {
        mongodb = await MongoMemoryReplSet.create({
            replSet: {
                count: 1,
                dbName: 'test',
                storageEngine: 'wiredTiger',
            },
        });
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ConfigService)
            .useClass(ConfigServiceFake)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        mongoClient = moduleFixture.get(getMongoToken());
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