import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MemberId } from '../../member-registration/domain/ids/member-id';
import { MembershipFeesAggregateModel } from './membership-fees-aggregate.repo';
import { FeeId } from '../domain/ids/fee-id';
import { ISerializer } from '@fizzbuds/ddd-toolkit';

export class MembershipFeesSerializer implements ISerializer<MembershipFeesAggregate, MembershipFeesAggregateModel> {
    public modelToAggregate(aggregateModel: MembershipFeesAggregateModel): MembershipFeesAggregate {
        const fees = aggregateModel.fees.map((fee) => {
            return { feeId: FeeId.fromString(fee.feeId), value: fee.value, deleted: fee.deleted };
        });
        return new MembershipFeesAggregate(MemberId.fromString(aggregateModel.id), fees, aggregateModel.creditAmount);
    }

    public aggregateToModel(aggregate: MembershipFeesAggregate): MembershipFeesAggregateModel {
        const fees = aggregate['fees'].map((fee) => {
            return { feeId: fee.feeId.toString(), value: fee.value, deleted: fee.deleted };
        });
        return { id: aggregate.id.toString(), fees, creditAmount: aggregate['creditAmount'] };
    }
}
