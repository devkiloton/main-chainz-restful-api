import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { Response } from 'src/types/response';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { UserReq } from 'src/types/user-req';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  async createOne(
    @Req()
    req: UserReq,
    @Body()
    createOrderDto: CreateOrderDto,
  ): Promise<Response<OrderEntity>> {
    const userId = req.user.sub;
    const possibleOrder = await this.orderService.createOne({ userId, createOrderDto });
    return {
      message: 'Order created successfully',
      data: possibleOrder,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(
    @Req()
    req: UserReq,
  ): Promise<Response<OrderEntity[]>> {
    const userId = req.user.sub;
    const listOrders = await this.orderService.findAll(userId);
    return {
      message: 'Orders retrieved successfully',
      data: listOrders,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async findOne(
    @Req()
    req: UserReq,
    @Param('id')
    id: string,
  ): Promise<Response<OrderEntity>> {
    const userId = req.user.sub;
    const possibleOrder = await this.orderService.findOne({ id, userId });
    return {
      message: 'Order retrieved successfully',
      data: possibleOrder,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  async update(
    @Req() req: UserReq,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Response<OrderEntity>> {
    const userId = req.user.sub;
    const possibleOrder = await this.orderService.updateOne({ userId, id, updateOrderDto });
    return {
      message: 'Order updated successfully',
      data: possibleOrder,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  async remove(
    @Req()
    req: UserReq,
    @Param('id')
    id: string,
  ): Promise<Response<void>> {
    console.log(req);
    const userId = req.user.sub;
    await this.orderService.removeOne({ userId, id });
    return {
      message: 'Order deleted successfully',
    };
  }
}
