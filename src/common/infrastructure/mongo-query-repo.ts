import { Collection, CreateIndexesOptions, Document, IndexDirection, IndexSpecification, MongoClient } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { isEmpty } from 'lodash';

type IndexType<T> = {
    [key in keyof T]?: IndexDirection;
};

@Injectable()
export abstract class MongoQueryRepo<RM extends Document> implements OnModuleInit {
    private logger = new Logger(this.constructor.name);
    protected readonly collection: Collection<RM>;
    protected abstract readonly indexes: { indexSpec: IndexType<RM>; options?: CreateIndexesOptions }[];

    constructor(mongoClient: MongoClient, private readonly collectionName: string) {
        // TODO wrap collection with a proxy to log all queries
        this.collection = mongoClient.db().collection(this.collectionName);
    }

    async onModuleInit() {
        this.logger.log(`Creating index for id field.`);
        await this.collection.createIndex({ id: 1 }, { unique: true });
        if (!isEmpty(this.indexes)) {
            for (const { indexSpec, options } of this.indexes) {
                this.logger.log(`Creating index for ${JSON.stringify(indexSpec)} field.`);
                await this.collection.createIndex(indexSpec as IndexSpecification, options);
            }
        }
    }
}
