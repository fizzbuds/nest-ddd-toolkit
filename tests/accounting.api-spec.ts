import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { getMongoToken } from '@golee/mongo-nest';
import { createMember } from './registration.api-spec';

describe('Accounting (api)', () => {
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

    // TODO add check of the creditAmount
    describe('/member-fees', () => {
        let memberId: string;
        beforeEach(async () => {
            memberId = await createMember(app);
        });

        describe('POST /member-fees/:memberId/', () => {
            it('should create a membership fee and return a feeId', async () => {
                const response = await request(app.getHttpServer())
                    .post(`/member-fees/${memberId}/`)
                    .send({ amount: 100 });
                expect(response.statusCode).toBe(201);
                expect(response.body).toMatchObject({ feeId: expect.any(String) });
            });
        });

        describe('GET /member-fees/', () => {
            beforeEach(async () => {
                await request(app.getHttpServer()).post(`/member-fees/${memberId}/`).send({ amount: 100 });
                await request(app.getHttpServer()).post(`/member-fees/${memberId}/`).send({ amount: 200 });
                await request(app.getHttpServer()).post(`/member-fees/${memberId}/`).send({ amount: 300 });
            });

            it('should return a list of membership fees', async () => {
                const response = await request(app.getHttpServer()).get(`/member-fees`);
                expect(response.body).toMatchObject([
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 100 },
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 200 },
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 300 },
                ]);
            });

            describe('When deleting the member', () => {
                beforeEach(async () => {
                    await request(app.getHttpServer()).delete(`/members/${memberId}`);
                });

                it('should delete all fees', async () => {
                    const response = await request(app.getHttpServer()).get(`/member-fees`);
                    expect(response.body).toEqual([]);
                });
            });
        });

        describe('DELETE /member-fees/:memberId/:feeId', () => {
            let feeId: string;

            beforeEach(async () => {
                const resp = await request(app.getHttpServer()).post(`/member-fees/${memberId}/`).send({ amount: 400 });
                feeId = resp.body.feeId;
            });

            it('should delete the fee', async () => {
                const resp = await request(app.getHttpServer()).delete(`/member-fees/${memberId}/${feeId}`);
                expect(resp.statusCode).toBe(200);
            });

            it('should remove the fee from the list', async () => {
                await request(app.getHttpServer()).delete(`/member-fees/${memberId}/${feeId}`);

                const response = await request(app.getHttpServer()).get(`/member-fees`);
                expect(response.body).toEqual([]);
            });
        });
    });
});