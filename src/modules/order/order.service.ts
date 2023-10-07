import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { isNil } from 'lodash';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly _orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
  ) {}

  public async createOne(data: { userId: string; createOrderDto: CreateOrderDto }): Promise<OrderEntity> {
    const order = new OrderEntity();
    order.currencyCode = data.createOrderDto.currencyCode;
    order.amount = data.createOrderDto.amount;
    order.status = data.createOrderDto.status;

    const options = { where: { id: data.userId } };
    const user = await this._userRepository.findOne(options);

    if (isNil(user)) {
      throw new NotFoundException('User not found');
    }

    order.user = user;
    const possibleOrder = await this._orderRepository.save(order);
    possibleOrder.user = user;
    if (isNil(possibleOrder)) {
      throw new HttpException('Order not created', 500);
    }
    return possibleOrder;
  }

  public async findAll(userId: string): Promise<OrderEntity[]> {
    const options: FindManyOptions<OrderEntity> = {
      order: { createdAt: 'DESC' },
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    };
    const orders = await this._orderRepository.find(options);
    if (isNil(orders)) {
      throw new NotFoundException('Orders not found');
    }
    return orders;
  }

  public async findOne(data: { id: string; userId: string }): Promise<OrderEntity> {
    const options: FindOneOptions<OrderEntity> = {
      where: { id: data.id, user: { id: data.userId } },
      relations: {
        user: true,
      },
    };
    const possibleOrder = await this._orderRepository.findOne(options);
    if (isNil(possibleOrder)) {
      throw new NotFoundException('Order not found');
    }
    return possibleOrder;
  }

  public async updateOne(data: { userId: string; id: string; updateOrderDto: UpdateOrderDto }): Promise<OrderEntity> {
    const options = {
      where: { id: data.id, user: { id: data.userId } },
      relations: { user: true },
    };

    const order = await this._orderRepository.findOne(options);
    if (isNil(order)) {
      throw new NotFoundException('Order not found');
    }

    if (order.user.id !== data.userId) {
      throw new ForbiddenException('You cannot update a order that is not yours.');
    }

    const newOrderObj = new OrderEntity();
    newOrderObj.currencyCode = data.updateOrderDto.currencyCode;
    newOrderObj.amount = data.updateOrderDto.amount;
    newOrderObj.status = data.updateOrderDto.status;

    Object.assign(order, newOrderObj);

    const possibleOrder = await this._orderRepository.save(order);
    if (isNil(possibleOrder)) {
      throw new HttpException('Order not updated', 500);
    }
    return possibleOrder;
  }

  public async removeOne(data: { userId: string; id: string }): Promise<void> {
    const order = await this._orderRepository.findOne({
      where: { id: data.id, user: { id: data.userId } },
      relations: { user: true },
    });
    if (isNil(order)) {
      throw new NotFoundException('Order not found');
    }

    await this._orderRepository.delete(order.id);
  }
}
