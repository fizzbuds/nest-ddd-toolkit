export class MemberAggregate {
    constructor(readonly id: string, private _name: string, private unregistered: boolean) {}

    public static create(id: string, name: string) {
        return new MemberAggregate(id, name, false);
    }

    get name() {
        return this._name;
    }

    public rename(newName: string) {
        this._name = newName;
    }

    public unregister() {
        this.unregistered = true;
    }

    public isUnregistered() {
        return this.unregistered;
    }
}
