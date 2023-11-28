import { Module } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  controllers: [BitcoinController],
  providers: [BitcoinService],
  imports: [WalletsModule],
})
export class BitcoinModule {}
