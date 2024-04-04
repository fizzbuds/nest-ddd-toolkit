import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';

export type MemberFeesQueryModel = {
    id: string;
    memberId: string;
    name: string;
    value: number;
    deleted: boolean;
};

@Injectable()
export class MemberFeesQueryRepo extends MongoQueryRepo<MemberFeesQueryModel & Document> {
    private static logger = new Logger(MemberFeesQueryRepo.name);
    protected readonly indexes = [];

    constructor(@InjectMongo() mongoClient: MongoClient) {
        super(mongoClient, 'member_fees_query_repo', undefined, MemberFeesQueryRepo.logger);
    }

    public async getFees(deleted = false) {
        return this.collection.find({ deleted }).toArray();
    }

    public async save(queryModel: MemberFeesQueryModel[], session?: ClientSession) {
        await this.collection.bulkWrite(
            queryModel.map((qm) => {
                return {
                    updateOne: {
                        filter: { id: qm.id },
                        update: { $set: { ...qm } },
                        upsert: true,
                    },
                };
            }),
            { session },
        );
    }
}
