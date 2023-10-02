import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Currency code is required' })
  public currencyCode!: string;
  @IsNotEmpty({ message: 'Order amount is required' })
  public amount!: number;
}
