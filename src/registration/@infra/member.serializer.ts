import { MemberAggregate } from '../domain/member.aggregate';

import { MemberAggregateModel } from './member.aggregate-repo';
import { ISerializer } from '@fizzbuds/ddd-toolkit';

export class MemberSerializer implements ISerializer<MemberAggregate, MemberAggregateModel> {
    public modelToAggregate(aggregateModel: MemberAggregateModel): MemberAggregate {
        return new MemberAggregate(aggregateModel.id, aggregateModel.name, aggregateModel.deleted);
    }

    public aggregateToModel(aggregate: MemberAggregate): MemberAggregateModel {
        return { id: aggregate.id, name: aggregate.name, deleted: aggregate.isDeleted() };
    }
}
