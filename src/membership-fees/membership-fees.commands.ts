import { MembershipFeesId } from './domain/membership-fees-id';

export class MembershipFeesCommands {
    public async createCmd() {
        return MembershipFeesId.generate();
    }
}
