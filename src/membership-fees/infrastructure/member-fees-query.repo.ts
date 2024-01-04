import { ClientSession, Document } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { Connection } from 'mongoose';

export type MemberFeesQueryModel = {
    id: string;
    memberId: string;
    name: string;
    value: number;
};

@Injectable()
export class MemberFeesQueryRepo extends MongoQueryRepo<MemberFeesQueryModel & Document> {
    private static logger = new Logger(MemberFeesQueryRepo.name);
    protected readonly indexes = [];

    public static providerFactory(conn: Connection) {
        return new MemberFeesQueryRepo(conn.getClient(), 'member_fees_query_repo', MemberFeesQueryRepo.logger);
    }

    public async getFees() {
        return this.collection.find({});
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
