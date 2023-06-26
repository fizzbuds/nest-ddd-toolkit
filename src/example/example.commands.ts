import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExampleAggregateRoot } from './domain';
import { IRepo } from '../common';
import { mongoExampleRepoToken } from './example.module';

@Injectable()
export class ExampleCommands {
    constructor(@Inject(mongoExampleRepoToken) private readonly repo: IRepo<ExampleAggregateRoot>) {}

    public async createCmd() {
        const exampleAggregateRoot = ExampleAggregateRoot.createEmpty();
        await this.repo.save(exampleAggregateRoot);

        return { exampleId: exampleAggregateRoot.getId().getString() };
    }

    public async addNameCmd(exampleId: string, name: string) {
        const exampleAggregateRoot = await this.repo.getById(exampleId);
        if (!exampleAggregateRoot) throw new NotFoundException();

        exampleAggregateRoot.addName(name);

        await this.repo.save(exampleAggregateRoot);
    }
}
