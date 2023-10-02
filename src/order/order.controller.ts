import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UuidService } from 'src/shared/services/uuid.service';
import { Response } from 'src/types/response';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly _uuidService: UuidService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Response<Promise<void>>> {
    const order = new OrderEntity(
      this._uuidService.generateUuid(),
      createOrderDto.currencyCode,
      createOrderDto.amount,
      new Date(),
      new Date(),
    );
    await this.orderService.create(order);
    return {
      message: 'Order created successfully',
    };
  }

  @Get()
  async findAll(): Promise<Response<OrderEntity[]>> {
    const list = await this.orderService.findAll();
    return {
      message: 'Orders retrieved successfully',
      data: list,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<OrderEntity>> {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new HttpException('Order not found', 404);
    }
    return {
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Response<OrderEntity>> {
    const possibleUser = await this.orderService.update(id, updateOrderDto);
    if (!possibleUser) {
      throw new HttpException('Order not found', 404);
    }
    return {
      message: 'Order updated successfully',
      data: possibleUser,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<boolean>> {
    const status = await this.orderService.remove(id);
    if (!status) {
      throw new HttpException('Order not found', 404);
    }
    return {
      message: 'Order deleted successfully',
    };
  }
}
