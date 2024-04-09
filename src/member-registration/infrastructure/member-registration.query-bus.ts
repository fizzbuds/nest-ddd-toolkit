import { LocalQueryBus } from '@fizzbuds/ddd-toolkit';
import { Logger, Provider } from '@nestjs/common';

export const MEMBER_REGISTRATION_QUERY_BUS = 'MEMBER_REGISTRATION_QUERY_BUS';

export const MemberRegistrationQueryBusProvider: Provider = {
    provide: MEMBER_REGISTRATION_QUERY_BUS,
    useFactory: () => {
        const logger = new Logger('MemberRegistrationQueryBus');
        return new LocalQueryBus(logger);
    },
};
