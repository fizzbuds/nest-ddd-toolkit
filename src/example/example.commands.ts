import { exampleMongoWriteRepoToken } from './example.module';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExampleAggregateRoot } from './domain';
import { GenericId, IAggregateRepo } from '../common';

@Injectable()
export class ExampleCommands {
    constructor(@Inject(exampleMongoWriteRepoToken) private readonly repo: IAggregateRepo<ExampleAggregateRoot>) {}

    public async createCmd() {
        const exampleAggregateRoot = ExampleAggregateRoot.createEmpty();
        await this.repo.save(exampleAggregateRoot);

        return exampleAggregateRoot.getId();
    }

    public async addNameCmd(exampleId: GenericId, name: string) {
        const exampleAggregateRoot = await this.repo.getById(exampleId);
        if (!exampleAggregateRoot) throw new NotFoundException();

        exampleAggregateRoot.addName(name);

        await this.repo.save(exampleAggregateRoot);
    }
}
