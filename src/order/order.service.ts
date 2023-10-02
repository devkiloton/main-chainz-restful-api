import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(OrderEntity) private readonly _orderRepository: Repository<OrderEntity>) {}

  public async create(_order: OrderEntity): Promise<void> {
    await this._orderRepository.save(_order);
  }

  public async findAll(): Promise<OrderEntity[]> {
    const options: FindManyOptions<OrderEntity> = { order: { createdAt: 'DESC' } };
    const orders = await this._orderRepository.find(options);
    return orders;
  }

  public async findOne(id: string): Promise<OrderEntity | null> {
    const options = { where: { id } };
    const possibleUser = await this._orderRepository.findOne(options);
    return possibleUser ?? null;
  }

  public async update(id: string, _updateOrderDto: UpdateOrderDto): Promise<OrderEntity | null> {
    const order = await this.findOne(id);
    if (!order) {
      return null;
    }
    const updatedOrder = await this._orderRepository.update(id, _updateOrderDto);
    return updatedOrder.raw.affectedRows > 0 ? order : null;
  }

  public async remove(id: string): Promise<boolean> {
    const isRemoved = await this._orderRepository.delete(id);
    return isRemoved.raw.affectedRows > 0;
  }
}
