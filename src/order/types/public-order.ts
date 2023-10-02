export class PublicOrder {
  constructor(
    id: string,
    currencyCode: string,
    amount: number,
    status: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.currencyCode = currencyCode;
    this.amount = amount;
    this.status = status;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  id: string;
  currencyCode: string;
  amount: number;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
