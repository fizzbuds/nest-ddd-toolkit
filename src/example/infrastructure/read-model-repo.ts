import { Collection, Connection } from 'mongoose';
import { AnyBulkWriteOperation, BulkWriteOptions, Filter, FindOptions } from 'mongodb';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

export interface ExampleReadModel {
    id: string;
    name: string;
}

@Injectable()
export class ExampleReadModelRepo implements OnModuleInit {
    private readonly collection: Collection<ExampleReadModel>;

    constructor(@InjectConnection() private readonly mongoConnection: Connection) {
        this.collection = mongoConnection.collection('example_read_model');
    }

    async onModuleInit() {
        await this.collection.createIndex({ id: 1 }, { unique: true });
    }

    public async getMany() {
        return await this.collection.find({}).toArray();
    }

    public async getOne(filter: Filter<ExampleReadModel>, options?: FindOptions) {
        return await this.collection.findOne(filter, options);
    }

    public async bulkWrite(operations: AnyBulkWriteOperation<ExampleReadModel>[], options?: BulkWriteOptions) {
        return await this.collection.bulkWrite(operations, options);
    }
}
