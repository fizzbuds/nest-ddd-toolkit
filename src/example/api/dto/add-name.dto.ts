import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class addNameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
