import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { HashService } from 'src/shared/services/hash/hash.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'rocess.env]',
      signOptions: { expiresIn: '48h' },
    }),
  ],
})
export class AuthModule {}
