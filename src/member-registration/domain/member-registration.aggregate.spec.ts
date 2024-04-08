import { MemberRegistrationAggregate } from './member-registration.aggregate';
import { v4 as uuidV4 } from 'uuid';

describe('MemberRegistrationAggregate', () => {
    describe('When creating a MemberRegistrationAggregate', () => {
        let memberRegistrationAggregate: MemberRegistrationAggregate;
        beforeEach(() => {
            memberRegistrationAggregate = MemberRegistrationAggregate.create(uuidV4(), 'John Doe');
        });

        it('should create it', () => {
            expect(memberRegistrationAggregate).toMatchObject({
                id: expect.anything(),
            });
        });
    });

    describe('Given an existing MemberRegistrationAggregate', () => {
        let memberRegistrationAggregate: MemberRegistrationAggregate;
        beforeEach(() => {
            memberRegistrationAggregate = MemberRegistrationAggregate.create(uuidV4(), 'John Doe');
        });

        describe('When deleting it', () => {
            it('should mark it as deleted', () => {
                memberRegistrationAggregate.delete();

                expect(memberRegistrationAggregate.isDeleted()).toBeTruthy();
            });
        });
    });
});
