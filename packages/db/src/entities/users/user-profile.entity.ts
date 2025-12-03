import type { UserInfo } from '@hbcore/types';
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
 * Stores user profile information (email, phone, name, photoUrl) separately from the core User entity.
 */
@Entity('user_profiles')
export class UserProfileEntity implements UserInfo {
  /** Unique identifier for the profile record */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Reference to the user */
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  /** User ID (foreign key) */
  @Column({ name: 'user_id', unique: true })
  userId!: number;

  /** User email address */
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  /** User phone number */
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string | null;

  /** User display name */
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string | null;

  /** User profile photo URL */
  @Column({ type: 'varchar', length: 512, nullable: true, name: 'photo_url' })
  photoUrl?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
