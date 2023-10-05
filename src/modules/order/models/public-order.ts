import { UserEntity } from 'src/modules/user/entities/user.entity';

export class PublicOrder {
  public id: string;
  public currencyCode: string;
  public amount: number;
  public status: string;
  public user: UserEntity;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    currencyCode: string,
    amount: number,
    status: string,
    userEntity: UserEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.currencyCode = currencyCode;
    this.amount = amount;
    this.status = status;
    this.user = userEntity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
