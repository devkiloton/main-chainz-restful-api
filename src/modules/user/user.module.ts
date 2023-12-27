import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UniqueEmailValidator } from './validators/unique-email.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from 'src/shared/services/hash/hash.service';
import { AuthModule } from '../auth/auth.module';
import { BitcoinService } from '../bitcoin/bitcoin.service';
import { WalletsService } from '../wallets/wallets.service';
import { WalletEntity } from '../wallets/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AuthModule, WalletEntity])],
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator, HashService, BitcoinService, WalletsService],
  exports: [UserService],
})
export class UserModule {}
