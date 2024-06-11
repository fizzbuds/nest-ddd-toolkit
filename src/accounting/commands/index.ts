import { AddFeeCommandHandler } from './add-fee.command-handler';
import { DeleteAllFeeCommandHandler } from './delete-all-fee.command-handler';
import { DeleteFeeCommandHandler } from './delete-fee.command-handler';

export const MemberFeesCommandHandlers = [AddFeeCommandHandler, DeleteAllFeeCommandHandler, DeleteFeeCommandHandler];
