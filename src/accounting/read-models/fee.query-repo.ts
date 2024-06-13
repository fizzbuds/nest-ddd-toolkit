import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';
import { MemberFeesAggregateModel } from '../infrastructure/member-fees.aggregate-repo';

export type FeeQueryModel = {
    id: string;
    memberId: string;
    value: number;
    paid: boolean;
    deleted: boolean;
};

@Injectable()
export class FeeQueryRepo extends MongoQueryRepo<FeeQueryModel & Document> implements OnModuleInit {
    private static logger = new Logger(FeeQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { deleted: 1 } }];

    constructor(@InjectMongo() mongoClient: MongoClient) {
        super(mongoClient, 'fees_read_model', undefined, FeeQueryRepo.logger);
    }

    async onModuleInit() {
        await this.init();
    }

    public async onMemberFeesSave(memberFeesAggregateModel: MemberFeesAggregateModel, session?: ClientSession) {}

    public async getFees(deleted = false) {
        return this.collection.find({ deleted }, { projection: { _id: 0 } }).toArray();
    }
}
