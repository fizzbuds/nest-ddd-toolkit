import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';

export interface MemberQueryModel {
    id: string;
    name: string;
    deleted: boolean;
}

@Injectable()
export class MemberQueryRepo extends MongoQueryRepo<MemberQueryModel & Document> implements OnModuleInit {
    private static logger = new Logger(MemberQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    constructor(@InjectMongo() mongoClient: MongoClient) {
        super(mongoClient, 'members_read_model', undefined, MemberQueryRepo.logger);
    }

    public async getMember(id: string) {
        return await this.collection.findOne({ id, deleted: false });
    }

    public async save(queryModel: MemberQueryModel, session?: ClientSession) {
        await this.collection.updateOne({ id: queryModel.id }, { $set: queryModel }, { upsert: true, session });
    }

    async onModuleInit() {
        await this.init();
    }
}
