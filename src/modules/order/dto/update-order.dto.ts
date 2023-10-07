import { IsOptional } from 'class-validator';
import { StatusOrder } from '../enum/status-order';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'BTC',
    required: false,
  })
  @IsOptional()
  public currencyCode!: string;

  @ApiProperty({
    example: 100,
    required: false,
  })
  @IsOptional()
  public amount!: number;

  @ApiProperty({
    example: StatusOrder.approved,
    required: false,
  })
  @IsOptional()
  public status!: StatusOrder;
}
