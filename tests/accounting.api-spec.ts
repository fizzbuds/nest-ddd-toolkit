import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { getMongoToken } from '@golee/mongo-nest';
import { createMember, setupMongoMemoryReplSet, setupNestApp } from './api-utils';
import { MemberFeesAggregateRepo } from '../src/accounting/@infra/member-fees.aggregate-repo';

async function addMemberFee(app: INestApplication, memberId: string, amount: number): Promise<request.Response> {
    return request(app.getHttpServer()).post(`/accounting/members/${memberId}/fees`).send({ amount });
}

async function deleteMemberFee(app: INestApplication<any>, memberId: string, feeId: any) {
    return request(app.getHttpServer()).delete(`/accounting/members/${memberId}/fees/${feeId}`);
}

async function payMemberFee(app: INestApplication<any>, memberId: string, feeId: any) {
    return request(app.getHttpServer()).post(`/accounting/members/${memberId}/fees/${feeId}/pay`);
}

describe('Accounting (api)', () => {
    let mongodb: MongoMemoryReplSet;
    let mongoClient: MongoClient;
    let app: INestApplication;
    let memberFeesAggregateRepo: MemberFeesAggregateRepo;

    beforeAll(async () => {
        mongodb = await setupMongoMemoryReplSet();
        app = await setupNestApp(mongodb);

        mongoClient = app.get(getMongoToken());
        memberFeesAggregateRepo = app.get(MemberFeesAggregateRepo);
    });

    afterEach(async () => {
        await mongoClient.db().dropDatabase();
    });

    afterAll(async () => {
        await app.close();
        await mongodb.stop();
    });

    let memberId: string;

    beforeEach(async () => {
        memberId = await createMember(app);
    });

    describe('/accounting', () => {
        describe('/members/:memberId/fees (aggregate commands)', () => {
            describe('POST /accounting/members/:memberId/fees', () => {
                it('should create a membership fee and return a feeId', async () => {
                    const response = await addMemberFee(app, memberId, 100);

                    expect(response.statusCode).toBe(201);
                    expect(response.body).toMatchObject({ feeId: expect.any(String) });
                });

                it('should create a membership fee with a value', async () => {
                    const response = await addMemberFee(app, memberId, 100);
                    const feeId = response.body.feeId;

                    const memberFeesAggregate = await memberFeesAggregateRepo.getById(memberId);
                    expect(memberFeesAggregate?.getFee(feeId).value).toEqual(100);
                });
            });

            describe('DELETE /accounting/members/:memberId/fees/:feeId', () => {
                it('should soft delete the fee', async () => {
                    const feeId = (await addMemberFee(app, memberId, 100)).body.feeId;

                    const response = await deleteMemberFee(app, memberId, feeId);

                    expect(response.statusCode).toBe(200);
                    const memberFeesAggregate = await memberFeesAggregateRepo.getById(memberId);
                    expect(memberFeesAggregate?.getFee(feeId).deleted).toBeTruthy();
                });

                it('should decrease creditAmount', async () => {
                    const feeId = (await addMemberFee(app, memberId, 100)).body.feeId;

                    await deleteMemberFee(app, memberId, feeId);

                    const memberFeesAggregate = await memberFeesAggregateRepo.getById(memberId);
                    expect(memberFeesAggregate?.getCreditAmount()).toEqual(0);
                });
            });

            describe('POST /accounting/members/:memberId/fees/:feeId/pay', () => {
                it('should mark the fee as paid', async () => {
                    const feeId = (await addMemberFee(app, memberId, 100)).body.feeId;
                    const response = await payMemberFee(app, memberId, feeId);

                    expect(response.statusCode).toBe(202);
                    const memberFeesAggregate = await memberFeesAggregateRepo.getById(memberId);
                    expect(memberFeesAggregate?.getFee(feeId).paid).toBeTruthy();
                });

                it('should decrease creditAmount', async () => {
                    const feeId = (await addMemberFee(app, memberId, 100)).body.feeId;

                    await payMemberFee(app, memberId, feeId);

                    const memberFeesAggregate = await memberFeesAggregateRepo.getById(memberId);
                    expect(memberFeesAggregate?.getCreditAmount()).toEqual(0);
                });
            });
        });

        describe('/accounting/fees (read model handlers and queries)', () => {
            describe('GET /accounting/fees', () => {
                describe('Given a member with no fees', () => {
                    it('should return no fees', async () => {
                        const response = await request(app.getHttpServer()).get(`/accounting/fees`);
                        expect(response.body).toEqual([]);
                    });
                });

                describe('Given a member with some fees', () => {
                    it('should return some fees', async () => {
                        await addMemberFee(app, memberId, 100);

                        const response = await request(app.getHttpServer()).get(`/accounting/fees`);
                        expect(response.body).toEqual([
                            expect.objectContaining({
                                deleted: false,
                                memberId,
                                paid: false,
                                value: 100,
                            }),
                        ]);
                    });
                });

                describe.skip('Given a deleted member with some fees', () => {
                    it('should return no fees', async () => {
                        await addMemberFee(app, memberId, 100);
                        await request(app.getHttpServer()).delete(`/members/${memberId}`);

                        const response = await request(app.getHttpServer()).get(`/accounting/fees`);
                        expect(response.body).toEqual([]);
                    });
                });
            });
        });

        describe('/credit-amounts (read model handlers and queries)', () => {
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
                    it('should return name and right creditAmount', async () => {
                        await addMemberFee(app, memberId, 100);

                        const response = await request(app.getHttpServer()).get(`/accounting/credit-amounts`);
                        expect(response.body).toEqual([
                            expect.objectContaining({ memberName: 'John Doe', creditAmount: 100 }),
                        ]);
                    });
                });

                describe('Given a renamed member with some fees', () => {
                    it('should return right name and creditAmount', async () => {
                        await addMemberFee(app, memberId, 100);
                        await request(app.getHttpServer()).put(`/members/${memberId}`).send({ name: 'Jane Doe' });

                        const response = await request(app.getHttpServer()).get(`/accounting/credit-amounts`);
                        expect(response.body).toEqual([
                            expect.objectContaining({ memberName: 'Jane Doe', creditAmount: 100 }),
                        ]);
                    });
                });

                describe.skip('Given a deleted member with some fees', () => {
                    it('should return nothing', async () => {
                        await addMemberFee(app, memberId, 100);
                        await request(app.getHttpServer()).delete(`/members/${memberId}`);

                        const response = await request(app.getHttpServer()).get(`/accounting/credit-amounts`);
                        expect(response.body).toEqual([]);
                    });
                });
            });
        });
    });
});
