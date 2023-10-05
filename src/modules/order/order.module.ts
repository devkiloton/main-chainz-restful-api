import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UuidService } from 'src/shared/services/uuid/uuid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity])],
  controllers: [OrderController],
  providers: [OrderService, UuidService],
})
export class OrderModule {}
