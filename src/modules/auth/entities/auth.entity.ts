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

  @Column({ nullable: true, type: 'text' })
  public authCode!: string | null;

  @Column({ nullable: true, type: 'text' })
  public signGeneralCode!: string | null;

  @Column({ nullable: true, type: 'text' })
  public resetPasswordCode!: string | null;

  @Column({ name: 'reset_password_code_updated_at', nullable: true, type: 'timestamp' })
  public resetPasswordCodeUpdatedAt!: Date;

  @Column({ name: 'sign_in_code_updated_at', nullable: true, type: 'timestamp' })
  public signGeneralCodeUpdatedAt!: Date;

  @Column({ name: 'auth_code_updated_at', nullable: true, type: 'timestamp' })
  public authCodeUpdatedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  @OneToOne(() => UserEntity, user => user.auth)
  public user!: UserEntity;
}
