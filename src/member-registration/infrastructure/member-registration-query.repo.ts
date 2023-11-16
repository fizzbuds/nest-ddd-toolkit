import { Document } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MemberId } from '../domain/ids/member-id';
import { Connection } from 'mongoose';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';

export interface MemberRegistrationQueryModel {
    id: string;
    name: string;
}

@Injectable()
export class MemberRegistrationQueryRepo extends MongoQueryRepo<MemberRegistrationQueryModel & Document> {
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    public static providerFactory = (conn: Connection) => {
        return new MemberRegistrationQueryRepo(conn.getClient(), 'member_query_repo');
    };

    public async getMember(id: MemberId) {
        return await this.collection.findOne({ id: id.toString() });
    }

    public async save(queryModel: MemberRegistrationQueryModel) {
        await this.collection.updateOne({ id: queryModel.id }, { $set: queryModel }, { upsert: true });
    }
}
