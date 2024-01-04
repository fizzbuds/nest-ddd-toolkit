import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'mongoose';
import * as os from 'os';
import { OutboxPattern } from '@fizzbuds/ddd-toolkit';

@Injectable()
export class MemberRegistrationOutbox {
    private static logger = new Logger(MemberRegistrationOutbox.name);

    public static providerFactory(conn: Connection) {
        return new OutboxPattern(
            os.hostname(),
            conn.getClient(),
            async (eventRoutingKey, eventPayload) => {
                MemberRegistrationOutbox.logger.log(
                    `Pubblico evento ${eventRoutingKey} ${JSON.stringify(eventPayload)}`,
                );
            },
            MemberRegistrationOutbox.logger,
        );
    }
}
