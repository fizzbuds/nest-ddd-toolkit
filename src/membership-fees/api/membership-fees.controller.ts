import { Controller, Post } from '@nestjs/common';
import { MembershipFeesCommands } from '../membership-fees.commands';

@Controller('fees')
export class MembershipFeesController {
    constructor(private readonly membershipFeesCommands: MembershipFeesCommands) {}

    @Post('')
    public async create() {
        return (await this.membershipFeesCommands.createCmd()).toString();
    }
}
