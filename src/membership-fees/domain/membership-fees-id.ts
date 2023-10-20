import { GenericId } from '../../common';

export class MembershipFeesId extends GenericId<'membership-fees'> {
    // in order to have incompatible types, between other extended GenericId classes, type must be set as READONLY!!
    readonly type = 'membership-fees';
}
