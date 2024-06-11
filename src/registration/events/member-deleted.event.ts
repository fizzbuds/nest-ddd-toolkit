import { Event } from '@fizzbuds/ddd-toolkit';

export class MemberDeleted extends Event<{ memberId: string }> {
    constructor(payload: { memberId: string }) {
        super(payload);
    }
}
