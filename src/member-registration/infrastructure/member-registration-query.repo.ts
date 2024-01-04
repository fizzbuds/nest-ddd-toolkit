import { ClientSession, Document } from 'mongodb';
import { Logger } from '@nestjs/common';
import { MemberId } from '../domain/ids/member-id';
import { Connection } from 'mongoose';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { getConnectionToken } from '@nestjs/mongoose';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';

export interface MemberRegistrationQueryModel {
    id: string;
    name: string;
}

export class MemberRegistrationQueryRepo extends MongoQueryRepo<MemberRegistrationQueryModel & Document> {
    private static logger = new Logger(MemberRegistrationQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    public static providerFactory(): Provider {
        return {
            provide: MemberRegistrationQueryRepo,
            inject: [getConnectionToken()],
            useFactory: (conn: Connection) => {
                return new MemberRegistrationQueryRepo(
                    conn.getClient(),
                    'members_query_model',
                    MemberRegistrationQueryRepo.logger,
                );
            },
        };
    }

    public async getMember(id: MemberId) {
        return await this.collection.findOne({ id: id.toString() });
    }

    public async save(queryModel: MemberRegistrationQueryModel, session?: ClientSession) {
        await this.collection.updateOne({ id: queryModel.id }, { $set: queryModel }, { upsert: true, session });
    }
}
