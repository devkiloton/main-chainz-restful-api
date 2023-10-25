import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Sector } from '../enum/sector';
import { Category } from '../enum/category';
import { Language } from '../enum/language';

@Entity()
export class ArticleEntity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  public id!: string;

  @Column({ type: 'varchar', length: 100 })
  public title!: string;

  @Column({ type: 'enum', enum: Language, default: null, nullable: true })
  public language!: string;

  @Column({ type: 'varchar', name: 'base_64' })
  public base64!: string;

  @Column({ type: 'enum', enum: Sector, default: null, nullable: true })
  public sector!: string;

  @Column({ type: 'enum', enum: Category, default: null, nullable: true })
  public category!: string;

  @Column({ default: 0 })
  public views!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
