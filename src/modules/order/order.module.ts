import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthEntity } from '../auth/entities/auth.entity';
import { AuthService } from '../auth/auth.service';
import { HashService } from 'src/shared/services/hash/hash.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity, AuthEntity])],
  controllers: [OrderController],
  providers: [OrderService, AuthService, HashService, UserService, EmailService],
})
export class OrderModule {}
