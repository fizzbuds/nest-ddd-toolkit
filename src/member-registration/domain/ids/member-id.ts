import { GenericId } from '@fizzbuds/ddd-toolkit';

export class MemberId extends GenericId<'member'> {
    // in order to have incompatible types, between other extended GenericId classes, type must be set as READONLY!!
    readonly type = 'member';
}
