import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UuidService } from 'src/shared/services/uuid.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly _uuidService: UuidService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<void> {
    const order = new OrderEntity(
      this._uuidService.generateUuid(),
      createOrderDto.currencyCode,
      createOrderDto.amount,
      new Date(),
      new Date(),
    );
    return this.orderService.create(order);
  }

  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderEntity> {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new HttpException('Order not found', 404);
    }
    return order;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const possibleUser = await this.orderService.update(id, updateOrderDto);
    if (!possibleUser) {
      throw new HttpException('Order not found', 404);
    }
    return possibleUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const status = await this.orderService.remove(id);
    if (!status) {
      throw new HttpException('Order not found', 404);
    }
  }
}
