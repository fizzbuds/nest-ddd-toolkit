import { Document, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';

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

    public async getCreditAmounts(deleted = false) {
        return this.collection.find({ deleted }, { projection: { _id: 0 } }).toArray();
    }
}
