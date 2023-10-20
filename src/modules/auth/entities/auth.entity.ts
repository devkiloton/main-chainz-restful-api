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

  @Column({ nullable: true, type: String })
  public authCode!: string | null;

  @Column({ name: 'code_updated_at', nullable: true, type: 'timestamp' })
  public codeUpdatedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  @OneToOne(() => UserEntity, user => user.auth)
  public user!: UserEntity;
}
