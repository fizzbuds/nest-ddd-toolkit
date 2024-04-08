import { Command } from '@fizzbuds/ddd-toolkit';

type CreateMemberCommandPayload = { name: string };

export class CreateMemberCommand extends Command<CreateMemberCommandPayload, { memberId: string }> {
    constructor(public readonly payload: CreateMemberCommandPayload) {
        super(payload);
    }
}
