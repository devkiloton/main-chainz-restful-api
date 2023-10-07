import { IsOptional } from 'class-validator';
import { StatusOrder } from '../enum/status-order';

export class UpdateOrderDto {
  @IsOptional()
  public currencyCode!: string;
  @IsOptional()
  public amount!: number;
  @IsOptional()
  public status!: StatusOrder;
}
