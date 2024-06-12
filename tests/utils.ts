import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function createMember(app: INestApplication) {
    const response = await request(app.getHttpServer()).post('/members/').send({ name: 'John Doe' });
    return response.body.id;
}
