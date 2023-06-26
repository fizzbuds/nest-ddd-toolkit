import { ISerializerDeserializer } from './serializer-deserializer';
import { Collection, Connection } from 'mongoose';
import { IRepoHooks } from './repo-hooks';
import { Document } from 'mongodb';
import { OnModuleInit } from '@nestjs/common';

export interface IRepo<A> {
    getById: (id: string) => Promise<A | null>;
    save: (aggregate: A) => Promise<void>;
}

export class MongoRepo<A, WM extends Document> implements IRepo<A>, OnModuleInit {
    constructor(
        private readonly serializerDeserializer: ISerializerDeserializer<A, WM>,
        private readonly mongoConn: Connection,
        private readonly collectionName: string,
        private readonly repoHooks?: IRepoHooks<A>,
    ) {
        this.collection = this.mongoConn.collection<WM>(this.collectionName);
    }

    private collection: Collection<WM>;

    async onModuleInit() {
        await this.collection.createIndex({ id: 1 }, { unique: true });
    }

    async save(aggregate: A) {
        const writeModel = this.serializerDeserializer.aggregateToWriteModel(aggregate);

        const session = await this.mongoConn.startSession();

        try {
            await session.withTransaction(async () => {
                await this.collection.updateOne(
                    { id: writeModel.id },
                    {
                        $set: { ...writeModel, updatedAt: new Date() },
                        $setOnInsert: { createdAt: new Date() } as any,
                    },
                    { upsert: true, session, ignoreUndefined: true },
                );
                if (this.repoHooks) await this.repoHooks.onSave(aggregate);
            });
        } finally {
            await session.endSession();
        }
    }

    async getById(id: string): Promise<A | null> {
        const writeModel = await this.collection.findOne({ id } as any);
        if (!writeModel) return null;
        return this.serializerDeserializer.writeModelToAggregate(writeModel as WM);
    }
}
