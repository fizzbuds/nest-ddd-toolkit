import { Document } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MongoQueryRepo } from '../../common/infrastructure/mongo-query-repo';
import { MemberId } from '../domain/ids/member-id';

export interface MemberRegistrationQueryModel {
    id: string;
}

@Injectable()
export class MemberRegistrationQueryRepo extends MongoQueryRepo<MemberRegistrationQueryModel & Document> {
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    public async getMember(id: MemberId) {
        return await this.collection.findOne({ id: id.toString() });
    }

    public async save(queryModel: MemberRegistrationQueryModel) {
        await this.collection.updateOne({ id: queryModel.id }, { $set: queryModel }, { upsert: true });
    }
}
