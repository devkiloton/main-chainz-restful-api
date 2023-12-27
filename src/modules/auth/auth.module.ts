import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from 'src/shared/services/hash/hash.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { UserService } from '../user/user.service';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { UserEntity } from '../user/entities/user.entity';
import { EmailService } from '../email/email.service';
import { WalletsService } from '../wallets/wallets.service';
import { BitcoinService } from '../bitcoin/bitcoin.service';
import { WalletEntity } from '../wallets/entities/wallet.entity';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    HashService,
    UserService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    EmailService,
    WalletsService,
    BitcoinService,
  ],
  imports: [
    JwtModule.registerAsync({
      useFactory: (_configService: ConfigService) => {
        return {
          global: true,
          secret: _configService.get('JWT_ACCESS_SECRET'),
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    TypeOrmModule.forFeature([AuthEntity, UserEntity, WalletEntity]),
  ],
  exports: [AuthService],
})
export class AuthModule {}
