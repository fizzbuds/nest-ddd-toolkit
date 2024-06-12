import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { RegisterMemberDto } from './dto/register-member.dto';
import { MembersService } from '../members.service';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @Post('')
    public async register(@Body() body: RegisterMemberDto) {
        const { memberId } = await this.membersService.registerMember(body.name);
        return { id: memberId };
    }

    @Get(':id')
    public async get(@Param('id') memberId: string) {
        const member = await this.membersService.getMember(memberId);
        if (!member) throw new NotFoundException();
        return member;
    }

    @Put(':id')
    public async rename(@Param('id') memberId: string, @Body() body: { name: string }) {
        return await this.membersService.renameMember(memberId, body.name);
    }

    @Delete(':id')
    public async delete(@Param('id') memberId: string) {
        await this.membersService.deleteMember(memberId);
    }
}
