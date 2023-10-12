import { IsNotEmpty } from 'class-validator';

// This DTO is used internally in the API to create a new fiat currency using USD as base
export class CreateFiatCurrencyDto {
  @IsNotEmpty({ message: 'Currency id is required' })
  public id!: string;
  @IsNotEmpty({ message: 'Currency rate is required' })
  public rate!: number;
  @IsNotEmpty({ message: 'Currency symbol is required' })
  public symbol!: string;
}
