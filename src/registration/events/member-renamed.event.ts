import { Event } from '@fizzbuds/ddd-toolkit';

export class MemberRenamed extends Event<{ memberId: string; memberName: string }> {
    constructor(payload: { memberId: string; memberName: string }) {
        super(payload);
    }
}
