import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UniqueEmailValidator } from './validators/unique-email.validator';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UniqueEmailValidator],
})
export class AuthModule {}
