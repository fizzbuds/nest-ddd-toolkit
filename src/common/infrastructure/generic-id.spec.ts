import { GenericId } from './generic-id';

class CustomId extends GenericId<'custom'> {
    readonly type = 'custom';
}

describe('GenericId', () => {
    describe('constructor', function () {
        it('should create an id object with correct type and value', () => {
            const id = new CustomId('foo');
            expect(id.type).toBe('custom');
            expect(id.value).toBe('foo');
        });

        it('should create an id object with type as prefix', () => {
            const id = new CustomId('foo');
            expect(id.toString()).toBe('custom_foo');
        });

        it('should throw an error if value is empty', () => {
            expect(() => new CustomId('')).toThrow('Value cannot be empty');
        });

        it('should throw an error if value is not a string', () => {
            expect(() => new CustomId(['ad'] as any as string)).toThrow('Value must be a string');
        });
    });

    describe('generate', function () {
        it('should create an id object with value as uuidv4', () => {
            const id = CustomId.generate();
            expect(id.toString()).toMatch(
                new RegExp(/^custom_[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            );
        });

        it('should create an instance equal to the one created with a complete constructor', function () {
            const id1 = CustomId.generate();
            const id2 = new CustomId(id1.value, 'custom');
            expect(id1).toEqual(id2);
        });
    });

    describe('fromString', function () {
        it('should create an id object from id string', () => {
            const id = CustomId.fromString('custom_foo');
            expect(id.type).toBe('custom');
            expect(id.value).toBe('foo');
        });

        it('should throw an exception if id string is not valid', function () {
            expect(() => CustomId.fromString('notValid')).toThrow('Invalid Id');
        });

        it('should throw an exception if id string does not match the type', function () {
            expect(() => CustomId.fromString('wrong_foo')).toThrow('Wrong Id type');
        });

        it('should create an instance equal to the one created with a complete constructor', function () {
            const id1 = CustomId.fromString('custom_foo');
            const id2 = new CustomId('foo', 'custom');
            expect(id1).toEqual(id2);
        });
    });

    describe('fromValue', function () {
        it('should create an id object with correct type and value', () => {
            const id = CustomId.fromValue('foo');
            expect(id.type).toBe('custom');
            expect(id.value).toBe('foo');
        });

        it('should create an id object with type as prefix', () => {
            const id = CustomId.fromValue('foo');
            expect(id.toString()).toBe('custom_foo');
        });

        it('should throw an error if value is empty', () => {
            expect(() => CustomId.fromValue('')).toThrow('Value cannot be empty');
        });

        it('should throw an error if value is not a string', () => {
            expect(() => CustomId.fromValue(['ad'] as any as string)).toThrow('Value must be a string');
        });

        it('should create an instance equal to the one created with a complete constructor', function () {
            const id1 = CustomId.fromValue('foo');
            const id2 = new CustomId('foo', 'custom');
            expect(id1).toEqual(id2);
        });
    });

    describe('equals', function () {
        class Custom2Id extends GenericId<'custom2'> {
            readonly type = 'custom2';
        }

        it('should return true when objects are equal as value and type', function () {
            const id = CustomId.fromString('custom_id');
            const idBis = CustomId.fromString('custom_id');
            expect(id.equals(idBis)).toBeTruthy();
        });

        it('should return false when objects are both generated', function () {
            const id = CustomId.generate();
            const idBis = CustomId.generate();
            expect(id.equals(idBis)).toBeFalsy();
        });

        it('should return false when objects are two instances of two different classes', function () {
            const id = CustomId.fromValue('id');
            const id2 = Custom2Id.fromValue('id');
            expect(id.equals(id2 as any as CustomId)).toBeFalsy();
        });

        it('should return true for instances created fromValue and fromString', function () {
            const id1 = CustomId.fromValue('foo');
            const id2 = CustomId.fromString('custom_foo');
            expect(id1.equals(id2)).toBeTruthy();
        });
    });
});
