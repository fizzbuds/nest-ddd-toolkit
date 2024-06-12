import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';
import { MemberFeesAggregateModel } from '../infrastructure/member-fees.aggregate-repo';
import { MembersService } from '../../registration/members.service';

export type CreditAmountQueryModel = {
    memberId: string;
    name: string;
    creditAmount: number;
    deleted: boolean;
};

@Injectable()
export class CreditAmountQueryRepo extends MongoQueryRepo<CreditAmountQueryModel & Document> implements OnModuleInit {
    private static logger = new Logger(CreditAmountQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { memberId: 1 } }];

    constructor(@InjectMongo() mongoClient: MongoClient, private readonly membersService: MembersService) {
        super(mongoClient, 'credit_amount_read_model', undefined, CreditAmountQueryRepo.logger);
    }

    async onModuleInit() {
        await this.init();
    }

    public async getCreditAmounts(deleted = false) {
        return this.collection.find({ deleted }).toArray();
    }

    public async onMemberFeesSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);

        await this.collection.updateOne(
            { memberId: queryModel.memberId },
            { $set: queryModel },
            { upsert: true, session },
        );
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
