import { Exclude } from 'class-transformer';
import { Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class FiatCurrency {
  @PrimaryColumn({ length: 3 })
  public id!: string;
  @Column({ length: 40, nullable: false, unique: true })
  public rate!: number;
  @Column({ length: 5, nullable: false, unique: true })
  public symbol!: string;
  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
