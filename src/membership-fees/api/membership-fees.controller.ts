import { Body, Controller, Param, Post } from '@nestjs/common';
import { MembershipFeesCommands } from '../membership-fees.commands';
import { MemberId } from '../../member-registration/domain/ids/member-id';

@Controller('members/:id/fees')
export class MembershipFeesController {
    constructor(private readonly membershipFeesCommands: MembershipFeesCommands) {}

    @Post('')
    public async create(@Param('id') memberId: string, @Body('amount') amount: number) {
        return (await this.membershipFeesCommands.addFeeCmd(MemberId.fromString(memberId), amount)).toString();
    }
}
