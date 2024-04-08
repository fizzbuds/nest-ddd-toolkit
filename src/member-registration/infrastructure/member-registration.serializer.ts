import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';

import { MemberRegistrationAggregateModel } from './member-registration-aggregate.repo';
import { ISerializer } from '@fizzbuds/ddd-toolkit';

export class MemberRegistrationSerializer
    implements ISerializer<MemberRegistrationAggregate, MemberRegistrationAggregateModel>
{
    public modelToAggregate(aggregateModel: MemberRegistrationAggregateModel): MemberRegistrationAggregate {
        return new MemberRegistrationAggregate(aggregateModel.id, aggregateModel.name, aggregateModel.deleted);
    }

    public aggregateToModel(aggregate: MemberRegistrationAggregate): MemberRegistrationAggregateModel {
        return { id: aggregate.id, name: aggregate['name'], deleted: aggregate.isDeleted() };
    }
}
