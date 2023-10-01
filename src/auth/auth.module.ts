import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { UniqueEmailValidator } from './validators/unique-email.validator';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthRepository, UniqueEmailValidator],
})
export class AuthModule {}
