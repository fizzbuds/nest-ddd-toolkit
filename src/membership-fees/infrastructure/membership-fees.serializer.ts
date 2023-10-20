import { ISerializer } from '../../common';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { FeesId } from '../domain/fees-id';

export class MembershipFeesSerializer implements ISerializer<MembershipFeesAggregate, MembershipFeesAggregateModel> {
    public aggregateModelToAggregate(aggregateModel: MembershipFeesAggregateModel): MembershipFeesAggregate {
        return new MembershipFeesAggregate(FeesId.fromString(aggregateModel.id));
    }

    public aggregateToAggregateModel(aggregate: MembershipFeesAggregate): MembershipFeesAggregateModel {
        return { id: aggregate['id'].toString() };
    }
}
