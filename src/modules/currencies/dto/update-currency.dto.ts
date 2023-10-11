import { PartialType } from '@nestjs/swagger';
import { CreateCurrencyDto } from './create-currency.dto';

// This DTO is used internally in the API to update a new currency using USD as base
export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {}
