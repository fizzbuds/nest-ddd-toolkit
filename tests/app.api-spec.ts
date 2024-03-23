import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController (api)', () => {
    let mongodb: MongoMemoryReplSet;
    let connection: Connection;
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

        connection = moduleFixture.get<Connection>(getConnectionToken());
    });

    afterEach(async () => {
        await connection.db.collection('member_registration_aggregate').deleteMany({});
        await connection.db.collection('member_query_repo').deleteMany({});
        await connection.db.collection('member_fees_query_repo').deleteMany({});
        await connection.db.collection('membership_fees_aggregate').deleteMany({});
    });

    afterAll(async () => {
        await app.close();
        await mongodb.stop();
    });

    async function createMember() {
        const response = await request(app.getHttpServer()).post('/member-registrations/').send({ name: 'John Doe' });
        return response.body.id;
    }

    describe('/member-registrations', () => {
        describe('POST /member-registrations', () => {
            it('should create a new member', async () => {
                const response = await request(app.getHttpServer())
                    .post('/member-registrations/')
                    .send({ name: 'John Doe' });
                expect(response.body).toMatchObject({ id: expect.any(String) });
                expect(response.statusCode).toBe(201);
            });
        });

        describe('GET /member-registrations/:id', () => {
            it('should return the member data', async () => {
                const memberId = await createMember();
                const response = await request(app.getHttpServer()).get(`/member-registrations/${memberId}`);
                expect(response.body.name).toBe('John Doe');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('DELETE /member-registrations/:id', () => {
            it('should delete the member', async () => {
                const memberId = await createMember();
                const deleteResponse = await request(app.getHttpServer()).delete(`/member-registrations/${memberId}`);
                expect(deleteResponse.statusCode).toBe(200);
                const getResponse = await request(app.getHttpServer()).get(`/member-registrations/${memberId}`);
                expect(getResponse.statusCode).toBe(404);
            });
        });
    });

    // TODO add check of the creditAmount
    describe('/membership-fees', () => {
        let memberId: string;
        beforeEach(async () => {
            memberId = await createMember();
        });

        describe('POST /membership-fees/:memberId/', () => {
            it('should create a membership fee and return a feeId', async () => {
                const response = await request(app.getHttpServer())
                    .post(`/membership-fees/${memberId}/`)
                    .send({ amount: 100 });
                expect(response.statusCode).toBe(201);
                expect(response.body).toMatchObject({ feeId: expect.any(String) });
            });
        });

        describe('GET /membership-fees/', () => {
            beforeEach(async () => {
                await request(app.getHttpServer()).post(`/membership-fees/${memberId}/`).send({ amount: 100 });
                await request(app.getHttpServer()).post(`/membership-fees/${memberId}/`).send({ amount: 200 });
                await request(app.getHttpServer()).post(`/membership-fees/${memberId}/`).send({ amount: 300 });
            });

            it('should return a list of membership fees', async () => {
                const response = await request(app.getHttpServer()).get(`/membership-fees`);
                expect(response.body).toMatchObject([
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 100 },
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 200 },
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 300 },
                ]);
            });

            describe('When deleting the member', () => {
                beforeEach(async () => {
                    await request(app.getHttpServer()).delete(`/member-registrations/${memberId}`);
                });

                it('should delete all fees', async () => {
                    const response = await request(app.getHttpServer()).get(`/membership-fees`);
                    expect(response.body).toEqual([]);
                });
            });
        });

        describe('DELETE /membership-fees/:memberId/:feeId', () => {
            let feeId: string;

            beforeEach(async () => {
                const resp = await request(app.getHttpServer())
                    .post(`/membership-fees/${memberId}/`)
                    .send({ amount: 400 });
                feeId = resp.body.feeId;
            });

            it('should delete the fee', async () => {
                const resp = await request(app.getHttpServer()).delete(`/membership-fees/${memberId}/${feeId}`);
                expect(resp.statusCode).toBe(200);
            });

            it('should remove the fee from the list', async () => {
                await request(app.getHttpServer()).delete(`/membership-fees/${memberId}/${feeId}`);

                const response = await request(app.getHttpServer()).get(`/membership-fees`);
                expect(response.body).toEqual([]);
            });
        });
    });
});
