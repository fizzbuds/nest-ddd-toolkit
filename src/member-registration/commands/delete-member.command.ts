import { Command } from '@fizzbuds/ddd-toolkit';

type DeleteMemberCommandPayload = { memberId: string };

export class DeleteMemberCommand extends Command<DeleteMemberCommandPayload> {
    constructor(public readonly payload: DeleteMemberCommandPayload) {
        super(payload);
    }
}
