export class MemberAggregate {
    constructor(readonly id: string, private _name: string, private deleted: boolean) {}

    get name() {
        return this._name;
    }

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
