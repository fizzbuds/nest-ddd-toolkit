import { ExampleAggregateRoot } from './example.aggregate-root';

describe('Example aggregate root', () => {
    let exampleAggregateRoot: ExampleAggregateRoot;

    describe('Given an existing example', () => {
        beforeEach(() => {
            exampleAggregateRoot = ExampleAggregateRoot.createEmpty();
        });

        it('name should be empty', () => {
            expect(exampleAggregateRoot).toMatchObject({ name: undefined });
        });

        describe('When addName', () => {
            it('name should be defined', () => {
                exampleAggregateRoot.addName('Gab');
                expect(exampleAggregateRoot).toMatchObject({ name: 'Gab' });
            });
        });
    });
});
