import { PartialType } from '@nestjs/swagger';
import { CreateFiatCurrencyDto } from './create-fiat-currency.dto';

export class UpdateFiatCurrencyDto extends PartialType(CreateFiatCurrencyDto) {}
