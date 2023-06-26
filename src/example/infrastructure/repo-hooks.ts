import { IRepoHooks } from '../../common';
import { ExampleAggregateRoot } from '../domain';
import { Injectable } from '@nestjs/common';
import { ExampleReadModel, ExampleReadModelRepo } from './read-model-repo';

@Injectable()
export class ExampleRepoHooks implements IRepoHooks<ExampleAggregateRoot> {
    constructor(private readonly exampleReadModelRepo: ExampleReadModelRepo) {}

    public async onSave(aggregate: ExampleAggregateRoot) {
        const exampleReadModel = this.composeReadModel(aggregate);

        await this.exampleReadModelRepo.bulkWrite([
            {
                updateOne: {
                    filter: { id: aggregate.getId().getString() },
                    update: { $set: { ...exampleReadModel } },
                    upsert: true,
                },
            },
        ]);
    }

    private composeReadModel(exampleAggregateRoot: ExampleAggregateRoot): ExampleReadModel {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return { id: exampleAggregateRoot.getId().getString(), name: exampleAggregateRoot.name };
    }
}
