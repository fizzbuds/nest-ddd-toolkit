import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';

export interface MemberRegistrationQueryModel {
    id: string;
    name: string;
    deleted: boolean;
}

@Injectable()
export class MemberRegistrationQueryRepo extends MongoQueryRepo<MemberRegistrationQueryModel & Document> {
    private static logger = new Logger(MemberRegistrationQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    constructor(@InjectMongo() mongoClient: MongoClient) {
        super(mongoClient, 'member_query_repo', undefined, MemberRegistrationQueryRepo.logger);
    }

    public async getMember(id: string) {
        return await this.collection.findOne({ id, deleted: false });
    }

    public async save(queryModel: MemberRegistrationQueryModel, session?: ClientSession) {
        await this.collection.updateOne({ id: queryModel.id }, { $set: queryModel }, { upsert: true, session });
    }
}
