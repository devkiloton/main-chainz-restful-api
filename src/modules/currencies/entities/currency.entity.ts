import { Column, Entity, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm';

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

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
