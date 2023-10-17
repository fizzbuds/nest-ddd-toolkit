import { IRepoHooks } from './repo-hooks';
import { Collection, Document, MongoClient } from 'mongodb';
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
        private readonly mongoClient: MongoClient,
        private readonly collectionName: string,
        private readonly repoHooks?: IRepoHooks<A>,
    ) {
        this.collection = this.mongoClient.db().collection(this.collectionName);
    }

    async onModuleInit() {
        await this.collection.createIndex({ id: 1 }, { unique: true });
    }

    async save(aggregate: WithOptionalVersion<A>) {
        const aggregateModel = this.serializer.aggregateToAggregateModel(aggregate);
        const aggregateModelWithVersion: WithVersion<AM> = { ...aggregateModel, __version: aggregate.__version || 0 };

        const session = this.mongoClient.startSession();

        try {
            await session.withTransaction(async () => {
                await this.collection.updateOne(
                    { id: aggregateModel.id, __version: aggregateModelWithVersion.__version } as any,
                    {
                        $set: {
                            ...aggregateModelWithVersion,
                            __version: aggregateModelWithVersion.__version + 1,
                            updatedAt: new Date(),
                        },
                        $setOnInsert: { createdAt: new Date() } as any,
                    },
                    { upsert: true, session, ignoreUndefined: true },
                );
                if (this.repoHooks) await this.repoHooks.onSave(aggregate);
            });
        } catch (e) {
            if (e.code === 11000) {
                throw new Error(
                    `Cannot save aggregate with id: ${aggregateModel.id} due to duplicated id, it might be also due to optimistic locking.`,
                );
            }
            throw e;
        } finally {
            await session.endSession();
        }
    }

    // TODO evaluate to implement getOrThrow
    async getById(id: GenericId): Promise<WithVersion<A> | null> {
        const aggregateModel = await this.collection.findOne({ id: id.toString() } as any);
        if (!aggregateModel) return null;
        const aggregate = this.serializer.aggregateModelToAggregate(aggregateModel as AM);
        return merge<A, { __version: number }>(aggregate, { __version: aggregateModel.__version });
    }
}
