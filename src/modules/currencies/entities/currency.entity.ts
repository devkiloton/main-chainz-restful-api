import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'currencies' })
export class Currency {
  @PrimaryColumn()
  public id!: string;

  @Column({ length: 40, nullable: false })
  public name!: string;

  @Column({ length: 8, nullable: false })
  public ticker!: string;

  @Column({ nullable: false })
  public price!: number;

  @Column({ nullable: false })
  public priceChange24h!: number;

  @Column({ nullable: false })
  public marketCap!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
