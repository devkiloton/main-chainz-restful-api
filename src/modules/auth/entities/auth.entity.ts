import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public readonly id!: string;

  @Column({ nullable: true, type: 'text' })
  public accessToken!: string | null;

  @Column({ nullable: true, type: 'text' })
  public refreshToken!: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  @OneToOne(() => UserEntity, user => user.auth)
  public user!: UserEntity;
}
