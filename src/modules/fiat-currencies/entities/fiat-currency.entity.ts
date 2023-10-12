import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'fiat-currencies' })
export class FiatCurrency {
  @PrimaryColumn({ length: 3 })
  public id!: string;

  @Column({ nullable: false, type: 'float8' })
  public rate!: number;

  @Column({ length: 5, nullable: false, unique: true })
  public symbol!: string;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
