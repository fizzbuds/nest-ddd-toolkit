import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MemberRegistrationCommands } from '../member-registration.commands';
import { MemberRegistrationQueries } from '../member-registration.queries';
import { MemberId } from '../domain/ids/member-id';

@Controller('members')
export class MemberRegistrationController {
    constructor(
        private readonly memberRegistrationCommands: MemberRegistrationCommands,
        private readonly memberRegistrationQueries: MemberRegistrationQueries,
    ) {}

    @Post('')
    public async create(@Body('name') name: string) {
        const id = (await this.memberRegistrationCommands.createCmd(name)).toString();
        return { id };
    }

    @Get(':id')
    public async get(@Param('id') id: string) {
        return this.memberRegistrationQueries.getMemberQuery(MemberId.fromString(id));
    }
}
