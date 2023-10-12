import { IsNotEmpty } from 'class-validator';

// This DTO is used internally in the API to create a new currency using USD as base
export class CreateCurrencyDto {
  @IsNotEmpty({ message: 'Currency id is required' })
  public id!: string;

  @IsNotEmpty({ message: 'Currency name is required' })
  public name!: string;

  @IsNotEmpty({ message: 'Currency price is required' })
  public price!: number;

  @IsNotEmpty({ message: 'Currency price change is required' })
  public priceChange24h!: number;

  @IsNotEmpty({ message: 'Currency market cap is required' })
  public marketCap!: number;
}
