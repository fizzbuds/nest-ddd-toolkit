import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';
import { MemberFeesAggregateModel } from '../infrastructure/member-fees.aggregate-repo';
import { MembersService } from '../../registration/members.service';

export type FeesQueryModel = {
    id: string;
    memberId: string;
    name: string;
    value: number;
    paid: boolean;
    deleted: boolean;
};

@Injectable()
export class FeesQueryRepo extends MongoQueryRepo<FeesQueryModel & Document> implements OnModuleInit {
    private static logger = new Logger(FeesQueryRepo.name);
    protected readonly indexes = [{ indexSpec: { deleted: 1 } }];

    constructor(@InjectMongo() mongoClient: MongoClient, private readonly membersService: MembersService) {
        super(mongoClient, 'fees_read_model', undefined, FeesQueryRepo.logger);
    }

    async onModuleInit() {
        await this.init();
    }

    public async getFees(deleted = false) {
        return this.collection.find({ deleted }).toArray();
    }

    public async onMemberFeesSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);
        if (!queryModel.length) return;

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

    private async composeQueryModel(aggregateModel: MemberFeesAggregateModel): Promise<FeesQueryModel[]> {
        const member = await this.membersService.getMember(aggregateModel.id);
        const name = member?.name ?? '';

        return aggregateModel.fees.map((fee) => {
            return {
                memberId: aggregateModel.id,
                id: fee.feeId,
                value: fee.value,
                name,
                paid: fee.paid,
                deleted: fee.deleted,
            };
        });
    }
}