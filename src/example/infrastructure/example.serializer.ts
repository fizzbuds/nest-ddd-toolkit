import { ExampleAggregateModel } from './example-aggregate.model';
import { ExampleAggregateRoot } from '../domain';
import { ISerializer } from '../../common';
import { ExampleId } from '../domain/example-id';

export class ExampleMongoSerializer implements ISerializer<ExampleAggregateRoot, ExampleAggregateModel> {
    public aggregateToAggregateModel(aggregate: ExampleAggregateRoot): ExampleAggregateModel {
        return {
            id: aggregate.getId().toString(),
            name: aggregate['name'],
        };
    }

    public aggregateModelToAggregate(writeModel: ExampleAggregateModel) {
        return new ExampleAggregateRoot(ExampleId.fromString(writeModel.id), writeModel.name);
    }
}
