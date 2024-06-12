import { MemberFeesAggregate } from '../domain/member-fees.aggregate';
import { MemberFeesAggregateModel } from './member-fees.aggregate-repo';
import { ISerializer } from '@fizzbuds/ddd-toolkit';

export class MemberFeesSerializer implements ISerializer<MemberFeesAggregate, MemberFeesAggregateModel> {
    public modelToAggregate(aggregateModel: MemberFeesAggregateModel): MemberFeesAggregate {
        const fees = aggregateModel.fees.map((fee) => {
            return { feeId: fee.feeId, value: fee.value, deleted: fee.deleted };
        });
        return new MemberFeesAggregate(aggregateModel.id, fees, aggregateModel.creditAmount);
    }

    public aggregateToModel(aggregate: MemberFeesAggregate): MemberFeesAggregateModel {
        const fees = aggregate['fees'].map((fee) => {
            return { feeId: fee.feeId, value: fee.value, deleted: fee.deleted };
        });
        return { id: aggregate.id, fees, creditAmount: aggregate['creditAmount'] };
    }
}
