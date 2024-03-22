import { ClientSession, Document } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

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

    constructor(@InjectConnection() conn: Connection) {
        super(conn.getClient(), 'member_fees_query_repo', undefined, MemberFeesQueryRepo.logger);
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
