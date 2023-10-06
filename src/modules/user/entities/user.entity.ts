import { Exclude } from 'class-transformer';
import { OrderEntity } from '../../order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public readonly id!: string;
  @Column({ name: 'name', nullable: false, length: 100 })
  public name!: string;
  @Column({ name: 'email', nullable: false, length: 100 })
  public email!: string;
  @Exclude()
  @Column({ name: 'password', nullable: false, length: 255 })
  public password!: string;
  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt!: Date;
  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public readonly deletedAt!: Date | null;
  @OneToMany(() => OrderEntity, order => order.user)
  public orders!: OrderEntity[];
}
