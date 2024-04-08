import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MembershipFeesAggregateModel } from './membership-fees-aggregate.repo';
import { ISerializer } from '@fizzbuds/ddd-toolkit';

export class MembershipFeesSerializer implements ISerializer<MembershipFeesAggregate, MembershipFeesAggregateModel> {
    public modelToAggregate(aggregateModel: MembershipFeesAggregateModel): MembershipFeesAggregate {
        const fees = aggregateModel.fees.map((fee) => {
            return { feeId: fee.feeId, value: fee.value, deleted: fee.deleted };
        });
        return new MembershipFeesAggregate(aggregateModel.id, fees, aggregateModel.creditAmount);
    }

    public aggregateToModel(aggregate: MembershipFeesAggregate): MembershipFeesAggregateModel {
        const fees = aggregate['fees'].map((fee) => {
            return { feeId: fee.feeId.toString(), value: fee.value, deleted: fee.deleted };
        });
        return { id: aggregate.id.toString(), fees, creditAmount: aggregate['creditAmount'] };
    }
}
