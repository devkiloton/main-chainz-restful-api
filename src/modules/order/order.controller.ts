import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UuidService } from 'src/shared/services/uuid/uuid.service';
import { Response } from 'src/types/response';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PublicOrder } from './models/public-order';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { UserReq } from 'src/types/user-req';

@UseGuards(AuthorizationGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly _uuidService: UuidService,
  ) {}

  @Post()
  async create(@Req() req: UserReq, @Body() createOrderDto: CreateOrderDto): Promise<Response<PublicOrder>> {
    const userId = req.user.sub;
    const order = new OrderEntity(
      this._uuidService.generateUuid(),
      createOrderDto.currencyCode,
      createOrderDto.amount,
      new Date(),
      new Date(),
    );
    const possibleOrder = await this.orderService.create({ userId, order });
    const orderToReturn = new PublicOrder(
      possibleOrder.id,
      possibleOrder.currencyCode,
      possibleOrder.amount,
      possibleOrder.status,
      possibleOrder.user,
      possibleOrder.createdAt,
      possibleOrder.updatedAt,
    );
    return {
      message: 'Order created successfully',
      data: orderToReturn,
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(@Req() req: UserReq): Promise<Response<PublicOrder[]>> {
    const userId = req.user.sub;
    const listOrders = await this.orderService.findAll(userId);
    return {
      message: 'Orders retrieved successfully',
      data: listOrders.map(
        order =>
          new PublicOrder(
            order.id,
            order.currencyCode,
            order.amount,
            order.status,
            order.user,
            order.createdAt,
            order.updatedAt,
          ),
      ),
    };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async findOne(@Req() req: UserReq, @Param('id') id: string): Promise<Response<PublicOrder>> {
    const possibleOrder = await this.orderService.findOne({ id, userId: req.user.sub });
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
        possibleOrder.user,
        possibleOrder.createdAt,
        possibleOrder.updatedAt,
      ),
    };
  }

  @Patch(':id')
  async update(
    @Req() req: UserReq,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Response<PublicOrder>> {
    const possibleOrder = await this.orderService.update({ userId: req.user.sub, id, updateOrderDto });
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
        possibleOrder.user,
        possibleOrder.createdAt,
        possibleOrder.updatedAt,
      ),
    };
  }

  @Delete(':id')
  async remove(@Req() req: UserReq, @Param('id') id: string): Promise<Response<boolean>> {
    const status = await this.orderService.remove({ userId: req.user.sub, id });
    if (!status) {
      throw new HttpException('Order not found', 404);
    }
    return {
      message: 'Order deleted successfully',
    };
  }
}
