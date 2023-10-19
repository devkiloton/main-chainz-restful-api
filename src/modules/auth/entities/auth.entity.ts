import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Column({ nullable: true })
  public accessToken!: string;

  @Column({ nullable: true })
  public refreshToken!: string;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
