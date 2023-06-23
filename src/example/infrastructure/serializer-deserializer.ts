import { ExampleWriteModel } from './write-model';
import { ExampleAggregateRoot } from '../domain';
import { ISerializerDeserializer } from '../../common';

export class ExampleMongoSerializerDeserializer
    implements ISerializerDeserializer<ExampleAggregateRoot, ExampleWriteModel>
{
    public aggregateToWriteModel(aggregate: ExampleAggregateRoot): ExampleWriteModel {
        return {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            id: aggregate.id,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            name: aggregate.name,
        };
    }

    public writeModelToAggregate(writeModel: ExampleWriteModel) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return new ExampleAggregateRoot(writeModel.id, writeModel.name);
    }
}
