import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';

describe('AppController (api)', () => {
    let mongodb: MongoMemoryReplSet;
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
    });

    describe('/membership-fees', () => {
        describe('Given a member', () => {
            let memberId: string;
            beforeAll(async () => {
                memberId = await createMember();
            });

            it('POST /membership-fees', async () => {
                const resp1 = await request(app.getHttpServer())
                    .post(`/membership-fees/${memberId}`)
                    .send({ amount: 100 });
                expect(resp1.body).toMatchObject({ feeId: expect.any(String) });
                const resp2 = await request(app.getHttpServer())
                    .post(`/membership-fees/${memberId}`)
                    .send({ amount: 200 });
                expect(resp2.body).toMatchObject({ feeId: expect.any(String) });
                const resp3 = await request(app.getHttpServer())
                    .post(`/membership-fees/${memberId}`)
                    .send({ amount: 300 });
                expect(resp3.body).toMatchObject({ feeId: expect.any(String) });
            });

            it('GET /membership-fees/', async () => {
                const response = await request(app.getHttpServer()).get(`/membership-fees`);
                expect(response.body).toMatchObject([
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 100 },
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 200 },
                    { id: expect.any(String), memberId: memberId, name: 'John Doe', value: 300 },
                ]);
            });
        });
    });
});
