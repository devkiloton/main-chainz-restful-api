import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusOrder } from '../enum/status-order';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id!: string;
  @Column({ name: 'currencyCode', nullable: false, length: 10 })
  public currencyCode!: string;
  @Column({ name: 'amount', nullable: false })
  public amount!: number;
  @Column({ name: 'status', nullable: false, enum: StatusOrder })
  public status!: StatusOrder;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public readonly deletedAt!: Date | null;
  @ManyToOne(() => UserEntity, user => user.orders, { onDelete: 'CASCADE' })
  public user!: UserEntity;

  constructor(
    id: string,
    currencyCode: string,
    amount: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
  ) {
    this.id = id;
    this.currencyCode = currencyCode;
    this.amount = amount;
    this.status = StatusOrder.processing;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
