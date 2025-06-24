import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';
import { MemberFeesAggregateModel } from '../@infra/member-fees.aggregate-repo';

export type CreditAmountQueryModel = {
    memberId: string;
    memberName: string;
    creditAmount: number;
    deleted: boolean;
};

@Injectable()
export class CreditAmountQueryRepo extends MongoQueryRepo<CreditAmountQueryModel & Document> implements OnModuleInit {
    private static logger = new Logger(CreditAmountQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { memberId: 1 } }];

    constructor(@InjectMongo() mongoClient: MongoClient) {
        super(mongoClient, 'credit_amounts_read_model', undefined, CreditAmountQueryRepo.logger);
    }

    async onModuleInit() {
        await this.init();
    }

    public async onMemberRegistered({ memberName, memberId }: { memberName: string; memberId: string }) {
        const queryModel: CreditAmountQueryModel = { memberId, memberName, creditAmount: 0, deleted: false };

        await this.collection.updateOne({ memberId }, { $set: queryModel }, { upsert: true });
    }

    public async onMemberRenamed(params: { memberName: string; memberId: string }) {
        // TODO: Implement member renaming logic
    }

    public async onMemberFeesSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);

        await this.collection.updateOne(
            { memberId: queryModel.memberId },
            { $set: queryModel },
            { upsert: true, session },
        );
    }

    public async onMemberDeleted(memberId: string) {
        await this.collection.updateOne({ memberId }, { $set: { deleted: true } });
    }

    public async getCreditAmounts(deleted = false) {
        return this.collection.find({ deleted }, { projection: { _id: 0 } }).toArray();
    }

    private async composeQueryModel(
        aggregateModel: MemberFeesAggregateModel,
    ): Promise<Partial<CreditAmountQueryModel>> {
        return {
            memberId: aggregateModel.id,
            creditAmount: aggregateModel.creditAmount,
        };
    }
}
