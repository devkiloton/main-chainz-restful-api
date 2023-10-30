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
import { Exclude } from 'class-transformer';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id!: string;
  @Column({ name: 'currencyCode', nullable: false, length: 10 })
  public currencyCode!: string;
  @Column({ name: 'amount', nullable: false })
  public amount!: number;
  @Column({ name: 'status', type: 'enum', enum: StatusOrder, default: StatusOrder.processing })
  public status!: StatusOrder;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public readonly deletedAt!: Date | null;
  @ManyToOne(() => UserEntity, user => user.orders)
  public user!: UserEntity;
}
