import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddNameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
