import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UniqueEmailValidator } from './validators/unique-email.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from 'src/shared/services/hash/hash.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator, HashService],
  exports: [UserService],
})
export class UserModule {}
