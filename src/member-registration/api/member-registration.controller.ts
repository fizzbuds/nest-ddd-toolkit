import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import { MemberRegistrationQueries } from '../member-registration.queries';
import { COMMAND_BUS } from '../../command-bus/command-bus.module';
import { CreateMemberCommand } from '../commands/create-member.command';
import { DeleteMemberCommand } from '../commands/delete-member.command';
import { ICommandBus } from '@fizzbuds/ddd-toolkit';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('member-registrations')
export class MemberRegistrationController {
    constructor(
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
        private readonly memberRegistrationQueries: MemberRegistrationQueries,
    ) {}

    @Post('')
    public async create(@Body() body: CreateMemberDto) {
        const { memberId } = await this.commandBus.sendSync(new CreateMemberCommand({ name: body.name }));
        return { id: memberId };
    }

    @Get(':id')
    public async get(@Param('id') id: string) {
        const result = await this.memberRegistrationQueries.getMemberQuery(id);
        if (!result) throw new NotFoundException();
        return result;
    }

    @Delete(':id')
    public async delete(@Param('id') memberId: string) {
        await this.commandBus.sendSync(new DeleteMemberCommand({ memberId }));
    }
}
