import { Logger } from '@nestjs/common';
import { Outbox } from '@fizzbuds/ddd-toolkit';
import { getConnectionToken } from '@nestjs/mongoose';
import * as amqplib from 'amqplib';
import { Connection } from 'mongoose';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ConfigService } from '@nestjs/config';

export type Event = { id: string; payload: any; routingKey: string };

export class MemberRegistrationOutbox {
    private static logger = new Logger(MemberRegistrationOutbox.name);

    public static providerFactory(): Provider {
        return {
            provide: MemberRegistrationOutbox,
            inject: [getConnectionToken(), ConfigService],
            useFactory: async (conn: Connection, configService: ConfigService) => {
                const uri = configService.getOrThrow('AMQP_URI');
                const exchangeName = configService.getOrThrow('AMQP_EXCHANGE_NAME');

                const amqpConn = await amqplib.connect(uri);
                const ch = await amqpConn.createConfirmChannel();
                await ch.assertExchange(exchangeName, 'topic');

                return new Outbox(
                    conn.getClient(),
                    async (events: Event[]) => {
                        events.forEach((event) => {
                            const content = Buffer.from(JSON.stringify(event.payload));
                            ch.publish(exchangeName, event.routingKey, content);
                        });
                        await ch.waitForConfirms();
                        MemberRegistrationOutbox.logger.debug(
                            `Published events ${events.map((e) => e.id).join(', ')} from the outbox.`,
                        );
                    },
                    'MemberRegistrationAggregate',
                    MemberRegistrationOutbox.logger,
                );
            },
        };
    }
}
