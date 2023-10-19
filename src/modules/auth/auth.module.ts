import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from 'src/shared/services/hash/hash.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthEntity } from './entities/auth.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService],
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '48h' },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    TypeOrmModule.forFeature([UserEntity, AuthEntity]),
  ],
  exports: [AuthService],
})
export class AuthModule {}
