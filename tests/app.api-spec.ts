import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

describe('AppController (api)', () => {
    let mongodb: MongoMemoryReplSet;
    let app: INestApplication;

    // FIXME setup a local database for testing
    beforeAll(async () => {
        mongodb = await MongoMemoryReplSet.create({
            replSet: {
                count: 1,
                dbName: 'test',
                storageEngine: 'wiredTiger',
            },
        });
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [MongooseModule.forRoot(mongodb.getUri('test')), AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    async function createMember() {
        const response = await request(app.getHttpServer()).post('/member-registrations/').send({ name: 'John Doe' });
        return response.body.id;
    }

    it('POST /member-registrations', async () => {
        const response = await request(app.getHttpServer()).post('/member-registrations/').send({ name: 'John Doe' });
        expect(response.statusCode).toBe(201);
    });

    it('GET /member-registrations/:id', async () => {
        const memberId = await createMember();
        const response = await request(app.getHttpServer()).get(`/member-registrations/${memberId}`);
        expect(response.body.name).toBe('John Doe');
    });

    describe('Create member registration, fees and get list', () => {
        let memberId: string;
        beforeAll(async () => {
            memberId = await createMember();
        });

        it('POST /membership-fees', async () => {
            const resp1 = await request(app.getHttpServer()).post(`/membership-fees/${memberId}`).send({ amount: 100 });
            expect(resp1.body).toMatchObject({ feeId: expect.any(String) });
            const resp2 = await request(app.getHttpServer()).post(`/membership-fees/${memberId}`).send({ amount: 200 });
            expect(resp2.body).toMatchObject({ feeId: expect.any(String) });
            const resp3 = await request(app.getHttpServer()).post(`/membership-fees/${memberId}`).send({ amount: 300 });
            expect(resp3.body).toMatchObject({ feeId: expect.any(String) });
        });

        it('GET /membership-fees/', async () => {
            const response = await request(app.getHttpServer()).get(`/membership-fees`);
            expect(response.body).toMatchObject([
                { feeId: expect.any(String), memberId: memberId, name: 'John Doe', value: 100 },
                { feeId: expect.any(String), memberId: memberId, name: 'John Doe', value: 200 },
                { feeId: expect.any(String), memberId: memberId, name: 'John Doe', value: 300 },
            ]);
        });
    });
});
