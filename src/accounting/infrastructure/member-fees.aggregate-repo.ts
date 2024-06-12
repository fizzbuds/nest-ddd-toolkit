import { MemberFeesRepoHooks } from './member-fees.repo-hook';
import { MemberFeesAggregate } from '../domain/member-fees.aggregate';
import { MemberFeesSerializer } from './member-fees.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectMongo } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';

export interface MemberFeesAggregateModel {
    id: string;
    fees: { feeId: string; value: number; deleted: boolean; paid: boolean }[];
    creditAmount: number;
}

export class MemberFeesAggregateRepo
    extends MongoAggregateRepo<MemberFeesAggregate, MemberFeesAggregateModel>
    implements OnModuleInit
{
    private static logger = new Logger(MemberFeesAggregateRepo.name);

    constructor(@InjectMongo() mongoClient: MongoClient, memberFeesRepoHooks: MemberFeesRepoHooks) {
        super(
            new MemberFeesSerializer(),
            mongoClient,
            'member_fees_write_model',
            undefined,
            memberFeesRepoHooks,
            MemberFeesAggregateRepo.logger,
        );
    }

    async onModuleInit() {
        await this.init();
    }
}
