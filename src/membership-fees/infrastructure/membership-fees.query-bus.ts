import { LocalQueryBus } from '@fizzbuds/ddd-toolkit';
import { Logger, Provider } from '@nestjs/common';

export const MEMBERSHIP_FEES_QUERY_BUS = 'MEMBERSHIP_FEES_QUERY_BUS';

export const MembershipFeesQueryBusProvider: Provider = {
    provide: MEMBERSHIP_FEES_QUERY_BUS,
    useFactory: () => {
        const logger = new Logger(' MembershipFeesQueryBus');
        return new LocalQueryBus(logger);
    },
};
