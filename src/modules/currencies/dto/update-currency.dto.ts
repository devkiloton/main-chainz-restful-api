import { IsOptional } from 'class-validator';

// This DTO is used internally in the API to update a new currency using USD as base
export class UpdateCurrencyDto {
  @IsOptional()
  public id!: string;

  @IsOptional()
  public name!: string;

  @IsOptional()
  public price!: number;

  @IsOptional()
  public priceChange24h!: number;

  @IsOptional()
  public marketCap!: number;
}
