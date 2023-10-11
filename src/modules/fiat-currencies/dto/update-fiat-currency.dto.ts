import { PartialType } from '@nestjs/swagger';
import { CreateFiatCurrencyDto } from './create-fiat-currency.dto';

// This DTO is used internally in the API to update fiat currency using USD as base
export class UpdateFiatCurrencyDto extends PartialType(CreateFiatCurrencyDto) {}
