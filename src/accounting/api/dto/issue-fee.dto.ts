import { IsNotEmpty, IsNumber } from 'class-validator';

export class IssueFeeDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}
