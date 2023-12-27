import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { WalletEntity } from './entities/wallet.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, UserEntity])],
  controllers: [],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
