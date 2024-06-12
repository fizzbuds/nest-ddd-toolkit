import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from '../src/env-validation-schema';

describe('AppController (api)', () => {
    let app: INestApplication;

    class ConfigServiceFake {
        get(key: string) {
            switch (key) {
                default:
                    return '';
            }
        }

        getOrThrow(key: string) {
            return this.get(key);
        }
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: envValidationSchema,
                }),
            ],
            controllers: [AppController],
        })
            .overrideProvider(ConfigService)
            .useClass(ConfigServiceFake)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/health', () => {
        it('should return ok', async () => {
            const response = await request(app.getHttpServer()).get('/health').send();
            expect(response.statusCode).toBe(200);
        });
    });
});
