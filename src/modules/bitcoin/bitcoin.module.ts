import { Module } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';
import { WalletsModule } from '../wallets/wallets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  controllers: [BitcoinController],
  providers: [BitcoinService],
  imports: [WalletsModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [BitcoinService],
})
export class BitcoinModule {}
