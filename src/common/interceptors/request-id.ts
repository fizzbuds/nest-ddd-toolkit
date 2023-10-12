import { GenericId } from '../infrastructure/generic-id';

export class RequestId extends GenericId<'request'> {
    // in order to have incompatible types, between other extended GenericId classes, type must be set as READONLY!!
    readonly type = 'request';
}
