import { IRepoHooks } from '../../common';
import { ExampleAggregateRoot } from '../domain';
import { Injectable } from '@nestjs/common';
import { ExampleQueryRepo, ExampleReadModel } from './example-query-repo.service';

@Injectable()
export class ExampleRepoHooks implements IRepoHooks<ExampleAggregateRoot> {
    constructor(private readonly exampleReadModelRepo: ExampleQueryRepo) {}

    public async onSave(aggregate: ExampleAggregateRoot) {
        const exampleReadModel = this.composeReadModel(aggregate);

        // TODO implement save instead of bulkWrite and move mongo query to exampleReadModelRepo
        await this.exampleReadModelRepo.bulkWrite([
            {
                updateOne: {
                    filter: { id: aggregate.getId().toString() },
                    update: { $set: { ...exampleReadModel } },
                    upsert: true,
                },
            },
        ]);
    }

    private composeReadModel(exampleAggregateRoot: ExampleAggregateRoot): ExampleReadModel {
        return { id: exampleAggregateRoot.getId().toString(), name: exampleAggregateRoot['name'] };
    }
}
