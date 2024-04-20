import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { AddFeeCommand } from '../commands/add-fee.command';
import { DeleteFeeCommand } from '../commands/delete-fee.command';
import { IQueryBus } from '@fizzbuds/ddd-toolkit';
import { AddFeeDto } from './dto/add-fee.dto';
import { MEMBERSHIP_FEES_QUERY_BUS } from '../infrastructure/membership-fees.query-bus';
import { GetMembershipFeesQuery } from '../queries/get-membership-fees.query';
import { CommandBus } from '../../command-bus/command-bus.module';

@Controller('membership-fees')
export class MembershipFeesController {
    constructor(
        private readonly commandBus: CommandBus,
        @Inject(MEMBERSHIP_FEES_QUERY_BUS) private readonly queryBus: IQueryBus,
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
        return await this.queryBus.execute(new GetMembershipFeesQuery({}));
    }
}
