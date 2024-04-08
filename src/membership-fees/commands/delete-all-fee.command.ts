import { Command } from '@fizzbuds/ddd-toolkit';

type DeleteAllFeeCommandPayload = { memberId: string };

export class DeleteAllFeeCommand extends Command<DeleteAllFeeCommandPayload> {
    constructor(public readonly payload: DeleteAllFeeCommandPayload) {
        super(payload);
    }
}
