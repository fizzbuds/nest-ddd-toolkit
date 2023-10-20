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
});
