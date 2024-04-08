import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { MemberRegistrationCommands } from '../member-registration.commands';
import { MemberRegistrationQueries } from '../member-registration.queries';

@Controller('member-registrations')
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
        const result = await this.memberRegistrationQueries.getMemberQuery(id);
        if (!result) throw new NotFoundException();
        return result;
    }

    @Delete(':id')
    public async delete(@Param('id') id: string) {
        return this.memberRegistrationCommands.deleteCmd(id);
    }
}
