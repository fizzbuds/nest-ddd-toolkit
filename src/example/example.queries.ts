import { Injectable, NotFoundException } from '@nestjs/common';
import { ExampleReadModelRepo } from './infrastructure/read-model-repo';

@Injectable()
export class ExampleQueries {
    constructor(private readonly exampleReadModelRepo: ExampleReadModelRepo) {}

    public async getOneExampleQuery(exampleId: string) {
        const example = await this.exampleReadModelRepo.getOne({ id: exampleId });
        if (!example) throw new NotFoundException();
        return example;
    }

    public async getExampleListQuery() {
        return await this.exampleReadModelRepo.getMany();
    }
}
