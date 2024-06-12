import { ClientSession, Document, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongoQueryRepo } from '@fizzbuds/ddd-toolkit';
import { InjectMongo } from '@golee/mongo-nest';

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

    constructor(@InjectMongo() mongoClient: MongoClient) {
        super(mongoClient, 'fees_read_model', undefined, FeesQueryRepo.logger);
    }

    public async getFees(deleted = false) {
        return this.collection.find({ deleted }).toArray();
    }

    public async save(queryModel: FeesQueryModel[], session?: ClientSession) {
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

    async onModuleInit() {
        await this.init();
    }
}
