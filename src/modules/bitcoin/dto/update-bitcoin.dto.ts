import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';

export class UpdateBitcoinDto extends PartialType(CreateWalletDto) {}
