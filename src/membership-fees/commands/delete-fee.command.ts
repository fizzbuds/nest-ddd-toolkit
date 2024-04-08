import { Command } from '@fizzbuds/ddd-toolkit';

export type DeleteFeeCommandPayload = { memberId: string; feeId: string };

export class DeleteFeeCommand extends Command<DeleteFeeCommandPayload> {
    constructor(public readonly payload: DeleteFeeCommandPayload) {
        super(payload);
    }
}
