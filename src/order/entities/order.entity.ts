import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { StatusOrder } from '../enum/status-order';

export class OrderEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id!: string;
  @Column({ name: 'currencyCode', nullable: false, length: 10 })
  public currencyCode!: string;
  @Column({ name: 'price', nullable: false, length: 100 })
  public price!: number;
  @Column({ name: 'status', nullable: false, enum: StatusOrder })
  public status!: StatusOrder;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public readonly deletedAt!: Date | null;
  constructor(
    id: string,
    currencyCode: string,
    price: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
  ) {
    this.id = id;
    this.currencyCode = currencyCode;
    this.price = price;
    this.status = StatusOrder.processing;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
