import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDtoDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
