import { Collection, Connection, Document } from 'mongoose';
import { CreateIndexesOptions, IndexDirection, IndexSpecification } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';

type IndexType<T> = {
    [key in keyof T]?: IndexDirection;
};

@Injectable()
export abstract class MongoQueryRepo<RM extends Document> implements OnModuleInit {
    private logger = new Logger(this.constructor.name);
    protected readonly collection: Collection<RM>;
    protected abstract readonly indexes: { indexSpec: IndexType<RM>; options?: CreateIndexesOptions }[];

    constructor(
        @InjectConnection() private readonly mongoConnection: Connection,
        private readonly collectionName: string,
    ) {
        // TODO wrap collection with a proxy to log all queries
        this.collection = mongoConnection.collection<RM>(this.collectionName);
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
