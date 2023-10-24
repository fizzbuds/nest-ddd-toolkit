import { MemberId } from './ids/member-id';

export class MemberRegistrationAggregate {
    constructor(readonly id: MemberId, private readonly name: string) {}

    public static create(id: MemberId, name: string) {
        return new MemberRegistrationAggregate(id, name);
    }
}
