import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import { COMMAND_BUS } from '../../command-bus/command-bus.module';
import { CreateMemberCommand } from '../commands/create-member.command';
import { DeleteMemberCommand } from '../commands/delete-member.command';
import { ICommandBus, IQueryBus } from '@fizzbuds/ddd-toolkit';
import { CreateMemberDto } from './dto/create-member.dto';
import { MEMBER_REGISTRATION_QUERY_BUS } from '../infrastructure/member-registration.query-bus';
import { GetMemberQuery } from '../queries/get-member.query';

@Controller('member-registrations')
export class MemberRegistrationController {
    constructor(
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
        @Inject(MEMBER_REGISTRATION_QUERY_BUS) private readonly memberRegistrationQueryBus: IQueryBus,
    ) {}

    @Post('')
    public async create(@Body() body: CreateMemberDto) {
        const { memberId } = await this.commandBus.sendSync(new CreateMemberCommand({ name: body.name }));
        return { id: memberId };
    }

    @Get(':id')
    public async get(@Param('id') memberId: string) {
        const result = await this.memberRegistrationQueryBus.execute(new GetMemberQuery({ memberId }));
        if (!result) throw new NotFoundException();
        return result;
    }

    @Delete(':id')
    public async delete(@Param('id') memberId: string) {
        await this.commandBus.sendSync(new DeleteMemberCommand({ memberId }));
    }
}
