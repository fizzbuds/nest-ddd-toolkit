import { isEmpty } from 'lodash';
import { v4 as uuid } from 'uuid';

// TODO create a dedicated IdError or personalize the error messages

export abstract class GenericId<T extends string = string> {
    // Must be implemented readonly in concrete classes!!!
    // Extended class name should end with Id example: ClassNameId NOT: ClassId2
    // Must be the same name as the extended class example: CustomId -> type = 'custom'
    protected abstract readonly type: T;

    constructor(readonly value: string, type?: string) {
        if (isEmpty(value)) throw new Error('Value cannot be empty');
        if (typeof value !== 'string') throw new Error('Value must be a string');
        if (type && type !== this.typeFromClassNameWithoutId()) throw new Error('Wrong Id type');
    }

    private typeFromClassNameWithoutId() {
        return this.constructor.name.replace(/Id$/, '').trim().toLowerCase();
    }

    static generate<IdType>(this: { new (_value: string): IdType }): IdType {
        return new this(uuid());
    }
    static fromString<IdType>(this: { new (_value: string, _type: string): IdType }, idString: string): IdType {
        const [type, value] = idString.split('_');
        if (!value) {
            throw new Error('Invalid Id');
        }
        return new this(value, type);
    }

    static fromValue<IdType>(this: { new (value: string): IdType }, idValue: string): IdType {
        return new this(idValue);
    }
    equals(other: GenericId<T>): boolean {
        if (!(other instanceof GenericId)) {
            return false;
        }
        return other.type === this.type && other.value === this.value;
    }

    toString() {
        return `${this.type}_${this.value}`;
    }
}
