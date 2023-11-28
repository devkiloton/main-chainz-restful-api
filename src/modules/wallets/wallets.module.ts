import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { WalletEntity } from './entities/wallet.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, UserEntity]), UserModule],
  controllers: [],
  providers: [WalletsService, UserService],
  exports: [WalletsService],
})
export class WalletsModule {}
