import { GenericId } from '../../common';

export class MembershipFeesId extends GenericId<'membershipfees'> {
    // in order to have incompatible types, between other extended GenericId classes, type must be set as READONLY!!
    readonly type = 'membershipfees';
}
