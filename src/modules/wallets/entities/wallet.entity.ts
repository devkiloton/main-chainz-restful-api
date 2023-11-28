import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { SupportedCurrencies } from 'src/types/shared/supported-currencies';

@Entity({ name: 'wallets' })
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id!: string;
  @Column({ type: 'enum', enum: SupportedCurrencies, default: SupportedCurrencies.btc })
  public currencyCode!: SupportedCurrencies;
  @Column()
  public seed!: string;
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
