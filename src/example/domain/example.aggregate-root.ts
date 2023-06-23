import { v4 as uuid } from 'uuid';

export class ExampleAggregateRoot {
    private constructor(private id: string, private name?: string) {}

    public addName(name: string) {
        this.name = name;
    }

    static createEmpty() {
        const id = uuid();
        return new ExampleAggregateRoot(id);
    }

    public getId() {
        return this.id;
    }
}
