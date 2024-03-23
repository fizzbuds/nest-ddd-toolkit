import { Event } from '@fizzbuds/ddd-toolkit/dist/event-bus/event';

export class MemberDeleted extends Event<{ memberId: string }> {
    constructor(payload: { memberId: string }) {
        super(payload);
    }
}
