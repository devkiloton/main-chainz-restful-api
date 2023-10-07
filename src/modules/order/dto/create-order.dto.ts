import { IsNotEmpty, IsOptional } from 'class-validator';
import { StatusOrder } from '../enum/status-order';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Currency code is required' })
  public currencyCode!: string;
  @IsNotEmpty({ message: 'Order amount is required' })
  public amount!: number;
  @IsOptional()
  public status!: StatusOrder;
}
