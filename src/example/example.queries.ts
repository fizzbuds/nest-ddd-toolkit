import { Injectable, NotFoundException } from '@nestjs/common';
import { ExampleReadRepo } from './infrastructure';

@Injectable()
export class ExampleQueries {
    constructor(private readonly exampleReadModelRepo: ExampleReadRepo) {}

    public async getOneExampleQuery(exampleId: string) {
        const example = await this.exampleReadModelRepo.getOne({ id: exampleId });
        if (!example) throw new NotFoundException();
        return example;
    }

    public async getExampleListQuery() {
        return await this.exampleReadModelRepo.getMany();
    }
}
