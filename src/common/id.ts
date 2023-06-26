import { v4 as uuid } from 'uuid';

export class Id {
    private type: string;
    private value: string;

    constructor(type: string, value: string) {
        this.type = type;
        this.value = value;
    }

    static createFromType(type: string): Id {
        const value = uuid();
        return new Id(type, value);
    }

    getString(): string {
        return `${this.type}_${this.value}`;
    }
}
