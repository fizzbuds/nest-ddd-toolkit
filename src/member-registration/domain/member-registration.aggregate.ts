import { MemberId } from './ids/member-id';

export class MemberRegistrationAggregate {
    constructor(readonly id: MemberId, private readonly name: string, private deleted: boolean) {}

    public static create(id: MemberId, name: string) {
        return new MemberRegistrationAggregate(id, name, false);
    }

    public delete() {
        this.deleted = true;
    }

    public isDeleted() {
        return this.deleted;
    }
}
