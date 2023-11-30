import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  public satoshis!: number;

  @IsString()
  public receiver!: string;
}
