import { ISerializer } from '../../common';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberId } from '../domain/ids/member-id';

import { MemberRegistrationAggregateModel } from './member-registration-aggregate.repo';

export class MemberRegistrationSerializer
    implements ISerializer<MemberRegistrationAggregate, MemberRegistrationAggregateModel>
{
    public aggregateModelToAggregate(aggregateModel: MemberRegistrationAggregateModel): MemberRegistrationAggregate {
        return new MemberRegistrationAggregate(MemberId.fromString(aggregateModel.id), aggregateModel['name']);
    }

    public aggregateToAggregateModel(aggregate: MemberRegistrationAggregate): MemberRegistrationAggregateModel {
        return { id: aggregate.id.toString(), name: aggregate['name'] };
    }
}
