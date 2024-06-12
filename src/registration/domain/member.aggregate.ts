export class MemberAggregate {
    constructor(readonly id: string, private _name: string, private deleted: boolean) {}

    public static create(id: string, name: string) {
        return new MemberAggregate(id, name, false);
    }

    get name() {
        return this._name;
    }

    public rename(newName: string) {
        this._name = newName;
    }

    public delete() {
        this.deleted = true;
    }

    public isDeleted() {
        return this.deleted;
    }
}
