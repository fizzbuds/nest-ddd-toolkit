import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { MemberAggregate } from './domain/member.aggregate';
import { MemberAggregateRepo } from './infrastructure/member.aggregate-repo';
import { EventBus } from '../event-bus/event-bus.module';

@Injectable()
export class MembersService {
    constructor(private readonly memberAggregateRepo: MemberAggregateRepo, private readonly eventBus: EventBus) {}

    public async registerMember(name: string) {
        const memberId = uuidV4();
        const memberAggregate = MemberAggregate.create(memberId, name);

        await this.memberAggregateRepo.save(memberAggregate);

        return { memberId };
    }

    public async deleteMember(memberId: string) {
        const member = await this.memberAggregateRepo.getById(memberId);
        if (!member) throw new NotFoundException('Member not found');

        member.delete();
        await this.memberAggregateRepo.save(member);
    }

    public async getMember(memberId: string) {
        const member = await this.memberAggregateRepo.getById(memberId);
        if (!member || member.isDeleted()) return null;

        return { id: member.id, name: member.name };
    }

    public async renameMember(memberId: string, newName: string) {
        const member = await this.memberAggregateRepo.getById(memberId);
        if (!member) throw new NotFoundException('Member not found');

        member.rename(newName);
        await this.memberAggregateRepo.save(member);

        return { id: member.id, name: member.name };
    }
}
