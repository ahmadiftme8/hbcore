import type { Email, Phone, UserId, UserInfo, UserProfileId } from '@hbcore/types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

/**
 * User profile entity.
 * Stores user profile information (email, phone, name) separately from the core User entity.
 */
@Entity('user_profiles')
export class UserProfileEntity implements UserInfo {
  /** Unique identifier for the profile record */
  @PrimaryGeneratedColumn()
  id!: UserProfileId;

  /** Reference to the user */
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  /** User ID (foreign key) */
  @Column({ name: 'user_id', unique: true })
  userId!: UserId;

  /** User email address */
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: Email | null;

  /** User phone number */
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: Phone | null;

  /** User display name */
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string | null;

  /** User first name */
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstname?: string | null;

  /** User last name */
  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
