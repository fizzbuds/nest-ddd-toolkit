import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ExampleCommands } from '../example.commands';
import { addNameDto } from './dto/add-name.dto';
import { ExampleQueries } from '../example.queries';

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleCommands: ExampleCommands, private readonly exampleQueries: ExampleQueries) {}

    @Post('')
    public async create() {
        return await this.exampleCommands.createCmd();
    }

    @Put(':id/add-name')
    public async addName(@Param('id') id: string, @Body() { name }: addNameDto) {
        return await this.exampleCommands.addNameCmd(id, name);
    }

    @Get(':id')
    public async getOneOrThrow(@Param('id') exampleId: string) {
        return await this.exampleQueries.getOneExampleQuery(exampleId);
    }

    @Get('')
    public async getList() {
        return await this.exampleQueries.getExampleListQuery();
    }
}