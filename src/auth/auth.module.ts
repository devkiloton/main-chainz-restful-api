import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UniqueEmailValidator } from './validators/unique-email.validator';
import { UuidService } from 'src/shared/services/uuid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, UniqueEmailValidator, UuidService],
})
export class AuthModule {}
