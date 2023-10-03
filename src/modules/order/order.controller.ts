import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UuidService } from 'src/shared/services/uuid.service';
import { Response } from 'src/types/response';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PublicOrder } from './models/public-order';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly _uuidService: UuidService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Response<PublicOrder>> {
    const order = new OrderEntity(
      this._uuidService.generateUuid(),
      createOrderDto.currencyCode,
      createOrderDto.amount,
      new Date(),
      new Date(),
    );
    const possibleOrder = await this.orderService.create(order);
    return {
      message: 'Order created successfully',
      data: new PublicOrder(
        possibleOrder.id,
        possibleOrder.currencyCode,
        possibleOrder.amount,
        possibleOrder.status,
        possibleOrder.user.id,
        possibleOrder.createdAt,
        possibleOrder.updatedAt,
      ),
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(): Promise<Response<PublicOrder[]>> {
    const listOrders = await this.orderService.findAll();
    return {
      message: 'Orders retrieved successfully',
      data: listOrders.map(
        order =>
          new PublicOrder(
            order.id,
            order.currencyCode,
            order.amount,
            order.status,
            order.user.id,
            order.createdAt,
            order.updatedAt,
          ),
      ),
    };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async findOne(@Param('id') id: string): Promise<Response<PublicOrder>> {
    const possibleOrder = await this.orderService.findOne(id);
    if (!possibleOrder) {
      throw new HttpException('Order not found', 404);
    }
    return {
      message: 'Order retrieved successfully',
      data: new PublicOrder(
        possibleOrder.id,
        possibleOrder.currencyCode,
        possibleOrder.amount,
        possibleOrder.status,
        possibleOrder.user.id,
        possibleOrder.createdAt,
        possibleOrder.updatedAt,
      ),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Response<PublicOrder>> {
    const possibleOrder = await this.orderService.update(id, updateOrderDto);
    if (!possibleOrder) {
      throw new HttpException('Order not found', 404);
    }
    return {
      message: 'Order updated successfully',
      data: new PublicOrder(
        possibleOrder.id,
        possibleOrder.currencyCode,
        possibleOrder.amount,
        possibleOrder.status,
        possibleOrder.user.id,
        possibleOrder.createdAt,
        possibleOrder.updatedAt,
      ),
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
