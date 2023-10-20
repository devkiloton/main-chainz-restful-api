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

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService, UserService, AccessTokenStrategy, RefreshTokenStrategy, EmailService],
  imports: [
    JwtModule.registerAsync({
      useFactory: (_configService: ConfigService) => {
        return {
          global: true,
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
  ],
  exports: [AuthService],
})
export class AuthModule {}
