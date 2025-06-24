import { Event } from '@fizzbuds/ddd-toolkit';

export class MemberRenamed extends Event<unknown> {
    //TODO add event payload
    constructor(payload: unknown) {
        super(payload);
    }
}
