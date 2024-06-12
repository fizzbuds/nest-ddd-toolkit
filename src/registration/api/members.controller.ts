import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import { IQueryBus } from '@fizzbuds/ddd-toolkit';
import { RegisterMemberDto } from './dto/register-member.dto';
import { GetMemberQuery } from '../queries/get-member.query-handler';
import { MemberQueryBus } from '../infrastructure/member.query-bus';
import { MembersService } from '../members.service';

@Controller('members')
export class MembersController {
    constructor(
        private readonly membersService: MembersService,
        @Inject(MemberQueryBus) private readonly memberQueryBus: IQueryBus,
    ) {}

    @Post('')
    public async register(@Body() body: RegisterMemberDto) {
        const { memberId } = await this.membersService.registerMember(body.name);
        return { id: memberId };
    }

    @Get(':id')
    public async get(@Param('id') memberId: string) {
        const result = await this.memberQueryBus.execute(new GetMemberQuery({ memberId }));
        if (!result) throw new NotFoundException();
        return result;
    }

    @Delete(':id')
    public async delete(@Param('id') memberId: string) {
        await this.membersService.deleteMember(memberId);
    }
}
