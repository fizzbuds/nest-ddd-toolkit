import { Document } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MongoQueryRepo } from '../../common/infrastructure/mongo-query-repo';
import { MemberId } from '../../member-registration/domain/ids/member-id';

export interface MemberFeesQueryModel {
    id: string;
    name: string;
}

@Injectable()
export class MemberFeesQueryRepo extends MongoQueryRepo<MemberFeesQueryModel & Document> {
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    public async getFeesByMember(id: MemberId) {
        return this.collection.find({ id: id.toString() }).toArray();
    }

    public async save(queryModel: MemberFeesQueryModel) {
        await this.collection.updateOne({ id: queryModel.id }, { $set: queryModel }, { upsert: true });
    }
}
