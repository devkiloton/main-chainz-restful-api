import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { HashService } from 'src/shared/services/hash/hash.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService],
  imports: [UserModule],
})
export class AuthModule {}
