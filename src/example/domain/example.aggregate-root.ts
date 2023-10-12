import { ExampleId } from './example-id';

export class ExampleAggregateRoot {
    constructor(private id: ExampleId, private name?: string) {}

    static createEmpty() {
        const id = ExampleId.generate();
        return new ExampleAggregateRoot(id);
    }

    public getId() {
        return this.id;
    }

    public addName(name: string) {
        this.name = name;
    }
}
