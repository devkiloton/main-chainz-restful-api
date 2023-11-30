import { Exclude } from 'class-transformer';
import { OrderEntity } from '../../order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthEntity } from '../../auth/entities/auth.entity';
import { WalletEntity } from 'src/modules/wallets/entities/wallet.entity';

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
  @Column({ name: 'is_email_verified', nullable: false, default: false })
  public isEmailVerified!: boolean;
  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt!: Date;
  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public readonly deletedAt!: Date | null;
  @OneToMany(() => OrderEntity, order => order.user)
  public orders!: OrderEntity[];
  @OneToMany(() => WalletEntity, wallet => wallet.user)
  public wallets!: WalletEntity[];
  @OneToOne(() => AuthEntity, auth => auth.user, { cascade: true })
  @JoinColumn()
  public auth!: AuthEntity;
}
