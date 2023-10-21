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
        const response = await request(app.getHttpServer()).post('/members/').send({ name: 'John Doe' });
        return response.body.id;
    }

    it('POST /members', async () => {
        const response = await request(app.getHttpServer()).post('/members/').send({ name: 'John Doe' });
        expect(response.statusCode).toBe(201);
    });

    it('GET /members/:id', async () => {
        const memberId = await createMember();
        const response = await request(app.getHttpServer()).get(`/members/${memberId}`);
        expect(response.body.name).toBe('John Doe');
    });
});
