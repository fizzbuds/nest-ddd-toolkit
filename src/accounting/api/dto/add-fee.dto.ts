import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddFeeDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}
