import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { MemberFeesQueries } from '../member-fees-queries.service';
import { AddFeeCommand } from '../commands/add-fee.command';
import { DeleteFeeCommand } from '../commands/delete-fee.command';
import { COMMAND_BUS } from '../../command-bus/command-bus.module';
import { ICommandBus } from '@fizzbuds/ddd-toolkit';
import { AddFeeDto } from './dto/add-fee.dto';

@Controller('membership-fees')
export class MembershipFeesController {
    constructor(
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
        private readonly membershipFeesQueries: MemberFeesQueries,
    ) {}

    @Post(':memberId')
    public async addFee(@Param('memberId') memberId: string, @Body() body: AddFeeDto) {
        const { feeId } = await this.commandBus.sendSync(new AddFeeCommand({ memberId, amount: body.amount }));
        return { feeId };
    }

    @Delete(':memberId/:feeId')
    public async deleteFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.commandBus.sendSync(new DeleteFeeCommand({ memberId, feeId }));
    }

    @Get('/')
    public async getList() {
        return await this.membershipFeesQueries.getMemberFees();
    }
}
