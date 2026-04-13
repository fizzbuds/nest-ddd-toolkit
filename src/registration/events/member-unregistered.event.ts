import { Event } from '@fizzbuds/ddd-toolkit';

export class MemberUnregistered extends Event<{ memberId: string }> {
    constructor(payload: { memberId: string }) {
        super(payload);
    }
}
