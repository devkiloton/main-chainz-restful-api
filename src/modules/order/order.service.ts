import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly _orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
  ) {}

  private async findUser(id: string) {
    const options = { where: { id } };
    const user = await this._userRepository.findOne(options);

    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async create(data: { userId: string; order: OrderEntity }): Promise<OrderEntity> {
    const user = await this.findUser(data.userId);

    const possibleOrder = await this._orderRepository.save(data.order);
    possibleOrder.user = user;
    if (!possibleOrder) {
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
    return orders;
  }

  public async findOne(data: { id: string; userId: string }): Promise<OrderEntity | null> {
    const options: FindOneOptions<OrderEntity> = {
      where: { id: data.id, user: { id: data.userId } },
      relations: {
        user: true,
      },
    };
    const possibleOrder = await this._orderRepository.findOne(options);
    if (possibleOrder === null) {
      throw new NotFoundException('Order not found');
    }
    return possibleOrder;
  }

  public async update(data: {
    userId: string;
    id: string;
    updateOrderDto: UpdateOrderDto;
  }): Promise<OrderEntity | null> {
    const order = await this._orderRepository.findOne({
      where: { id: data.id },
      relations: { user: true },
    });
    if (order === null) {
      throw new NotFoundException('Order not found');
    }

    if (order.user.id !== data.userId) {
      throw new ForbiddenException('You cannot update a order that is not yours.');
    }

    Object.assign(order, UpdateOrderDto as unknown as OrderEntity);

    return this._orderRepository.save(order);
  }

  public async remove(data: { userId: string; id: string }): Promise<boolean> {
    const order = await this._orderRepository.findOne({
      where: { id: data.id, user: { id: data.userId } },
      relations: { user: true },
    });
    if (order === null) {
      throw new NotFoundException('Order not found');
    }
    if (order.user.id !== data.userId) {
      throw new ForbiddenException('You cannot delete a order that is not yours.');
    }

    const isRemoved = await this._orderRepository.delete(order.id);
    return isRemoved.raw.affectedRows > 0;
  }
}
