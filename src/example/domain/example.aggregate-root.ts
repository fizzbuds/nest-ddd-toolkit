import { Id } from '../../common';

export class ExampleAggregateRoot {
    private constructor(private id: Id, private name?: string) {}

    public addName(name: string) {
        this.name = name;
    }

    static createEmpty() {
        const id = Id.createFromType('example');
        return new ExampleAggregateRoot(id);
    }

    public getId() {
        return this.id;
    }
}
