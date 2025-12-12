import {
  AuthProvider,
  type Phone,
  type PhoneAuthCredential,
  type PhoneAuthCredentialId,
  type UserId,
} from '@hbcore/types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

/**
 * Phone authentication credential entity.
 * Stores phone-specific authentication data separately from user profile data.
 */
@Entity('phone_auth_credentials')
export class PhoneAuthCredentialEntity implements PhoneAuthCredential {
  /** Unique identifier for the credential record */
  @PrimaryGeneratedColumn()
  id!: PhoneAuthCredentialId;

  /** Reference to the user */
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  /** User ID (foreign key) */
  @Column({ name: 'user_id' })
  userId!: UserId;

  /** Authentication provider (always 'phone' for this entity) */
  @Column({ type: 'varchar', length: 20, name: 'provider', default: AuthProvider.PHONE })
  provider!: AuthProvider.PHONE;

  /** Phone number in E.164 format (unique identifier) */
  @Column({ type: 'varchar', length: 20, name: 'phone', unique: true })
  phone!: Phone;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
