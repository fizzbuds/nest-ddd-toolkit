import { ISerializer } from '../../common';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MembershipFeesId } from '../domain/membership-fees-id';
import { MembershipFeesAggregateModel } from './membership-fees-aggregate.model';

export class MembershipFeesSerializer implements ISerializer<MembershipFeesAggregate, MembershipFeesAggregateModel> {
    public aggregateModelToAggregate(aggregateModel: MembershipFeesAggregateModel): MembershipFeesAggregate {
        return new MembershipFeesAggregate(MembershipFeesId.fromString(aggregateModel.id), aggregateModel.fees);
    }

    public aggregateToAggregateModel(aggregate: MembershipFeesAggregate): MembershipFeesAggregateModel {
        return { id: aggregate.id.toString(), fees: aggregate['fees'] };
    }
}
