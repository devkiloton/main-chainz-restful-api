import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'currencies' })
export class Currency {
  @PrimaryColumn({ length: 8 })
  public id!: string;

  @Column({ length: 40, nullable: false, unique: true })
  public name!: string;

  @Column({ nullable: false })
  public price!: number;

  @Column({ nullable: false })
  public priceChange24h!: number;

  @Column({ nullable: false })
  public marketCap!: number;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
