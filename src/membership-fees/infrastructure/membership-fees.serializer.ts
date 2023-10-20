import { ISerializer } from '../../common';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';

export class MembershipFeesSerializer implements ISerializer<MembershipFeesAggregate, MembershipFeesAggregateModel> {
    public aggregateModelToAggregate(aggregateModel: MembershipFeesAggregateModel): MembershipFeesAggregate {
        return new MembershipFeesAggregate();
    }

    public aggregateToAggregateModel(aggregate: MembershipFeesAggregate): MembershipFeesAggregateModel {
        return { id: 'foo' };
    }
}
