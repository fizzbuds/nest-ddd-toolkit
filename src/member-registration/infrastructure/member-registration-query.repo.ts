import { ClientSession, Document } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import { MemberId } from '../domain/ids/member-id';
import { Connection } from 'mongoose';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';

export interface MemberRegistrationQueryModel {
    id: string;
    name: string;
    deleted: boolean;
}

@Injectable()
export class MemberRegistrationQueryRepo extends MongoQueryRepo<MemberRegistrationQueryModel & Document> {
    private static logger = new Logger(MemberRegistrationQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    public static providerFactory(conn: Connection) {
        return new MemberRegistrationQueryRepo(
            conn.getClient(),
            'member_query_repo',
            undefined,
            MemberRegistrationQueryRepo.logger,
        );
    }

    public async getMember(id: MemberId) {
        return await this.collection.findOne({ id: id.toString(), deleted: false });
    }

    public async save(queryModel: MemberRegistrationQueryModel, session?: ClientSession) {
        await this.collection.updateOne({ id: queryModel.id }, { $set: queryModel }, { upsert: true, session });
    }
}
