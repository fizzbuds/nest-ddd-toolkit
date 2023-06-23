import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ExampleCommands } from '../example.commands';
import { UpdateDtoDto } from './dto/update-dto.dto';

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleCommands: ExampleCommands) {}

    @Post('')
    public async create() {
        return await this.exampleCommands.createCmd();
    }

    @Put(':id/add-name')
    public async addName(@Param('id') id: string, @Body() { name }: UpdateDtoDto) {
        return await this.exampleCommands.addNameCmd(id, name);
    }
}
