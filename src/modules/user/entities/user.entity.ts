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
  public readonly name!: string;
  @Column({ name: 'email', nullable: false, length: 100 })
  public readonly email!: string;
  @Column({ name: 'password', nullable: false, length: 255, select: false })
  public readonly password!: string;
  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt!: Date;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public readonly deletedAt!: Date | null;
  @OneToMany(() => OrderEntity, order => order.user)
  public orders!: OrderEntity[];

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
