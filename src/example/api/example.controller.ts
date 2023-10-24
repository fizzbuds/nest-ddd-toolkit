import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ExampleCommands } from '../example.commands';
import { AddNameDto } from './dto/add-name.dto';
import { ExampleQueries } from '../example.queries';
import { ExampleId } from '../domain/example-id';

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleCommands: ExampleCommands, private readonly exampleQueries: ExampleQueries) {}

    @Post('')
    public async create() {
        return (await this.exampleCommands.createCmd()).toString();
    }

    @Put(':id/add-name')
    public async addName(@Param('id') id: string, @Body() { name }: AddNameDto) {
        return await this.exampleCommands.addNameCmd(ExampleId.fromString(id), name);
    }

    @Get(':id')
    public async getOne(@Param('id') exampleId: string) {
        return await this.exampleQueries.getOneExampleQuery(exampleId);
    }

    @Get('')
    public async getList() {
        return await this.exampleQueries.getExampleListQuery();
    }
}
