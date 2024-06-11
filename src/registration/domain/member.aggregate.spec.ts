import { MemberAggregate } from './member.aggregate';
import { v4 as uuidV4 } from 'uuid';

describe('MemberAggregate', () => {
    describe('When creating a MemberAggregate', () => {
        let memberAggregate: MemberAggregate;
        beforeEach(() => {
            memberAggregate = MemberAggregate.create(uuidV4(), 'John Doe');
        });

        it('should create it', () => {
            expect(memberAggregate).toMatchObject({
                id: expect.anything(),
            });
        });
    });

    describe('Given an existing MemberAggregate', () => {
        let memberAggregate: MemberAggregate;
        beforeEach(() => {
            memberAggregate = MemberAggregate.create(uuidV4(), 'John Doe');
        });

        describe('When deleting it', () => {
            it('should mark it as deleted', () => {
                memberAggregate.delete();

                expect(memberAggregate.isDeleted()).toBeTruthy();
            });
        });
    });
});
