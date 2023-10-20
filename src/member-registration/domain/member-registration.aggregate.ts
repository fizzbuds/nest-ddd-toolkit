import { MemberId } from './ids/member-id';

export class MemberRegistrationAggregate {
    constructor(readonly id: MemberId) {}

    public static create(id: MemberId) {
        return new MemberRegistrationAggregate(id);
    }
}
