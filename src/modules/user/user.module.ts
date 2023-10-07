import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UniqueEmailValidator } from './validators/unique-email.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from 'src/shared/services/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator, HashService],
  exports: [UserService],
})
export class UserModule {}
