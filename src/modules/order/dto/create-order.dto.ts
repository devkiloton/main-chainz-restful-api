import { IsNotEmpty, IsOptional } from 'class-validator';
import { StatusOrder } from '../enum/status-order';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 'BTC',
    required: true,
  })
  @IsNotEmpty({ message: 'Currency code is required' })
  public currencyCode!: string;

  @ApiProperty({
    example: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'Order amount is required' })
  public amount!: number;

  @ApiProperty({
    example: StatusOrder.processing,
    required: false,
  })
  @IsOptional()
  public status!: StatusOrder;
}
