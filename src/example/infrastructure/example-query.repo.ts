import { AnyBulkWriteOperation, BulkWriteOptions, Document, Filter, FindOptions } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MongoQueryRepo } from '../../common/infrastructure/mongo-query-repo';

export interface ExampleQueryModel {
    id: string;
    name?: string;
}

@Injectable()
export class ExampleQueryRepo extends MongoQueryRepo<ExampleQueryModel & Document> {
    protected readonly indexes = [{ indexSpec: { name: 1 } }];

    public async getMany() {
        return await this.collection.find({}).toArray();
    }

    public async getOne(filter: Filter<ExampleQueryModel & Document>, options?: FindOptions) {
        return await this.collection.findOne(filter, options);
    }

    public async bulkWrite(
        operations: AnyBulkWriteOperation<ExampleQueryModel & Document>[],
        options?: BulkWriteOptions,
    ) {
        return await this.collection.bulkWrite(operations, options);
    }
}
