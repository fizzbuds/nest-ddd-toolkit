import { MemberRegistrationAggregate } from './member-registration.aggregate';
import { MemberId } from './ids/member-id';

describe('MemberRegistrationAggregate', () => {
    describe('When creating a MemberRegistrationAggregate', () => {
        let memberRegistrationAggregate: MemberRegistrationAggregate;
        beforeEach(() => {
            memberRegistrationAggregate = MemberRegistrationAggregate.create(MemberId.generate(), 'John Doe');
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
            memberRegistrationAggregate = MemberRegistrationAggregate.create(MemberId.generate(), 'John Doe');
        });

        describe('When deleting it', () => {
            it('should mark it as deleted', () => {
                memberRegistrationAggregate.delete();

                expect(memberRegistrationAggregate.isDeleted()).toBeTruthy();
            });
        });
    });
});
