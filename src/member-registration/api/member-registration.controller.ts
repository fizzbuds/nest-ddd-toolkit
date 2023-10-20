import { Controller, Post } from '@nestjs/common';
import { MemberRegistrationCommands } from '../member-registration.commands';

@Controller('members')
export class MemberRegistrationController {
    constructor(private readonly memberRegistrationCommands: MemberRegistrationCommands) {}

    @Post('')
    public async create() {
        return (await this.memberRegistrationCommands.createCmd()).toString();
    }
}
