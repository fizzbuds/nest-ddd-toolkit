import { IRepoHooks } from '../../common';
import { ExampleAggregateRoot } from '../domain';
import { Injectable } from '@nestjs/common';
import { ExampleQueryModel, ExampleQueryRepo } from './example-query.repo';

@Injectable()
export class ExampleRepoHooks implements IRepoHooks<ExampleAggregateRoot> {
    constructor(private readonly exampleQueryRepo: ExampleQueryRepo) {}

    public async onSave(aggregate: ExampleAggregateRoot) {
        const exampleReadModel = this.composeReadModel(aggregate);

        // TODO implement save instead of bulkWrite and move mongo query to exampleReadModelRepo
        await this.exampleQueryRepo.bulkWrite([
            {
                updateOne: {
                    filter: { id: aggregate.getId().toString() },
                    update: { $set: { ...exampleReadModel } },
                    upsert: true,
                },
            },
        ]);
    }

    private composeReadModel(exampleAggregateRoot: ExampleAggregateRoot): ExampleQueryModel {
        return { id: exampleAggregateRoot.getId().toString(), name: exampleAggregateRoot['name'] };
    }
}
