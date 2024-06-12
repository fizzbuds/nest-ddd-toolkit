import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { getMongoToken } from '@golee/mongo-nest';

import { createMember } from './utils';

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
    describe('/accounting', () => {
        let memberId1: string;

        beforeEach(async () => {
            memberId1 = await createMember(app);
        });

        describe('POST /accounting/members/:memberId', () => {
            it('should create a membership fee and return a feeId', async () => {
                const response = await request(app.getHttpServer())
                    .post(`/accounting/members/${memberId1}/`)
                    .send({ amount: 100 });
                expect(response.statusCode).toBe(201);
                expect(response.body).toMatchObject({ feeId: expect.any(String) });
            });
        });

        describe('GET /accounting/fees', () => {
            beforeEach(async () => {
                await request(app.getHttpServer()).post(`/accounting/members/${memberId1}/`).send({ amount: 100 });
                await request(app.getHttpServer()).post(`/accounting/members/${memberId1}/`).send({ amount: 200 });
                await request(app.getHttpServer()).post(`/accounting/members/${memberId1}/`).send({ amount: 300 });
            });

            it('should return a list of membership fees', async () => {
                const response = await request(app.getHttpServer()).get(`/accounting/fees`);
                expect(response.body).toMatchObject([
                    { id: expect.any(String), memberId: memberId1, value: 100 },
                    { id: expect.any(String), memberId: memberId1, value: 200 },
                    { id: expect.any(String), memberId: memberId1, value: 300 },
                ]);
            });

            describe('When deleting the member', () => {
                beforeEach(async () => {
                    await request(app.getHttpServer()).delete(`/members/${memberId1}`);
                });

                it('should delete all fees', async () => {
                    const response = await request(app.getHttpServer()).get(`/accounting/fees`);
                    expect(response.body).toEqual([]);
                });
            });
        });

        describe('DELETE /accounting/members/:memberId/:feeId', () => {
            let feeId: string;

            beforeEach(async () => {
                const resp = await request(app.getHttpServer())
                    .post(`/accounting/members/${memberId1}/`)
                    .send({ amount: 400 });
                feeId = resp.body.feeId;
            });

            it('should delete the fee', async () => {
                const resp = await request(app.getHttpServer()).delete(`/accounting/members/${memberId1}/${feeId}`);
                expect(resp.statusCode).toBe(200);
            });

            it('should remove the fee from the list', async () => {
                await request(app.getHttpServer()).delete(`/accounting/members/${memberId1}/${feeId}`);

                const response = await request(app.getHttpServer()).get(`/accounting/fees`);
                expect(response.body).toEqual([]);
            });
        });

        describe('GET /accounting/credit-amounts', () => {
            describe('Given a member with no fees', () => {
                it('should return a credit amount document with name and 0 creditAmount', async () => {
                    const response = await request(app.getHttpServer()).get(`/accounting/credit-amounts`);
                    expect(response.body).toEqual([
                        expect.objectContaining({ memberName: 'John Doe', creditAmount: 0 }),
                    ]);
                });
            });

            describe('Given a member with some fees', () => {
                it('should return a credit amount document with name and 0 creditAmount', async () => {
                    await request(app.getHttpServer()).post(`/accounting/members/${memberId1}/`).send({ amount: 100 });

                    const response = await request(app.getHttpServer()).get(`/accounting/credit-amounts`);
                    expect(response.body).toEqual([
                        expect.objectContaining({ memberName: 'John Doe', creditAmount: 100 }),
                    ]);
                });
            });
        });
    });
});
