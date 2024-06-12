import { MemberAggregate } from '../domain/member.aggregate';
import { MemberSerializer } from './member.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectMongo } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';

export interface MemberAggregateModel {
    id: string;
    name: string;
    deleted: boolean;
}

export class MemberAggregateRepo
    extends MongoAggregateRepo<MemberAggregate, MemberAggregateModel>
    implements OnModuleInit
{
    private static logger = new Logger(MemberAggregateRepo.name);

    constructor(@InjectMongo() mongoClient: MongoClient) {
        super(
            new MemberSerializer(),
            mongoClient,
            'members_write_model',
            undefined,
            undefined,
            MemberAggregateRepo.logger,
        );
    }

    async onModuleInit() {
        await this.init();
    }
}
