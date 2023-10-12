import { IsOptional } from 'class-validator';

// This DTO is used internally in the API to update fiat currency using USD as base
export class UpdateFiatCurrencyDto {
  @IsOptional()
  public id!: string;
  @IsOptional()
  public rate!: number;
  @IsOptional()
  public symbol!: string;
}
