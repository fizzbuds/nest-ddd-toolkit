import { Collection, Connection } from 'mongoose';
import { IRepoHooks } from './repo-hooks';
import { Document } from 'mongodb';
import { OnModuleInit } from '@nestjs/common';
import { GenericId } from './generic-id';
import { ISerializer } from './serializer.interface';
import { merge } from 'lodash';

export interface IAggregateRepo<A> {
    getById: (id: GenericId) => Promise<WithVersion<A> | null>;
    save: (aggregate: A) => Promise<void>;
}

type DocumentWithId = { id: string } & Document;

export type WithVersion<T> = T & { __version: number };

type WithOptionalVersion<T> = T & { __version?: number };

// TODO probably we should create a dedicated interface wiht like DocumentWithIdAndTimestamps
export class MongoAggregateRepo<A, AM extends DocumentWithId> implements IAggregateRepo<A>, OnModuleInit {
    private collection: Collection<AM>;

    constructor(
        private readonly serializer: ISerializer<A, AM>,
        private readonly mongoConnection: Connection,
        private readonly collectionName: string,
        private readonly repoHooks?: IRepoHooks<A>,
    ) {
        this.collection = this.mongoConnection.collection(this.collectionName);
    }

    async onModuleInit() {
        await this.collection.createIndex({ id: 1 }, { unique: true });
    }

    async save(aggregate: WithOptionalVersion<A>) {
        const writeModel = this.serializer.aggregateToAggregateModel(aggregate);
        const writeModelWithId: WithVersion<AM> = { ...writeModel, __version: aggregate.__version || 0 };

        const session = await this.mongoConnection.startSession();

        try {
            await session.withTransaction(async () => {
                await this.collection.updateOne(
                    { id: writeModel.id, __version: writeModelWithId.__version } as any,
                    {
                        $set: { ...writeModelWithId, __version: writeModelWithId.__version + 1, updatedAt: new Date() },
                        $setOnInsert: { createdAt: new Date() } as any,
                    },
                    { upsert: true, session, ignoreUndefined: true },
                );
                if (this.repoHooks) await this.repoHooks.onSave(aggregate);
            });
        } catch (e) {
            if (e.code === 11000) {
                throw new Error(`Cannot save aggregate with id: ${writeModel.id} due to optimistic locking.`);
            }
            throw e;
        } finally {
            await session.endSession();
        }
    }

    async getById(id: GenericId): Promise<WithVersion<A> | null> {
        const aggregateModel = await this.collection.findOne({ id: id.toString() } as any);
        if (!aggregateModel) return null;
        const aggregate = this.serializer.aggregateModelToAggregate(aggregateModel as AM);
        return merge<A, { __version: number }>(aggregate, { __version: aggregateModel.__version });
    }
}
