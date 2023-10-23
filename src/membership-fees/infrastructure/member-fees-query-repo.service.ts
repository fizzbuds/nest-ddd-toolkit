import { Document } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MongoQueryRepo } from '../../common/infrastructure/mongo-query-repo';

export type MemberFeesQueryModel = {
    id: string;
    memberId: string;
    name: string;
    value: number;
};

@Injectable()
export class MemberFeesQueryRepo extends MongoQueryRepo<MemberFeesQueryModel & Document> {
    protected readonly indexes = [];

    public async getFees() {
        return this.collection.find({}).toArray();
    }

    public async save(queryModel: MemberFeesQueryModel[]) {
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
        );
    }
}
