import { Document } from 'mongoose';
import { AnyBulkWriteOperation, BulkWriteOptions, Filter, FindOptions } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MongoQueryRepo } from '../../common/infrastructure/mongo-query-repo';

export interface ExampleReadModel {
    id: string;
    name?: string;
}

@Injectable()
export class ExampleReadRepo extends MongoQueryRepo<ExampleReadModel & Document> {
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    public async getMany() {
        return await this.collection.find({}).toArray();
    }

    public async getOne(filter: Filter<ExampleReadModel & Document>, options?: FindOptions) {
        return await this.collection.findOne(filter, options);
    }

    // TODO implement document timestamps
    public async bulkWrite(
        operations: AnyBulkWriteOperation<ExampleReadModel & Document>[],
        options?: BulkWriteOptions,
    ) {
        return await this.collection.bulkWrite(operations, options);
    }
}
