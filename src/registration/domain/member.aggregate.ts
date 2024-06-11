export class MemberAggregate {
    constructor(readonly id: string, private readonly name: string, private deleted: boolean) {}

    public static create(id: string, name: string) {
        return new MemberAggregate(id, name, false);
    }

    public delete() {
        this.deleted = true;
    }

    public isDeleted() {
        return this.deleted;
    }
}
