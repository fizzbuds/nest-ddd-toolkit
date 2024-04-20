import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddFeeDto } from './dto/add-fee.dto';
import { CommandBus } from '../../command-bus/command-bus.module';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { DeleteFeeCommand } from '../commands/delete-fee.command-handler';
import { GetMembershipFeesQuery } from '../queries/get-membership-fees.query-handler';
import { MembershipFeesQueryBus } from '../infrastructure/membership-fees.query-bus';

@Controller('membership-fees')
export class MembershipFeesController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: MembershipFeesQueryBus) {}

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
        return await this.queryBus.execute(new GetMembershipFeesQuery({}));
    }
}
