import type { User } from '@hbcore/types';
import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// @ai: Never modify this file.

/**
 * User entity following the "Entity Extends Domain Type" pattern.
 * Extends the User domain type from @hbcore/types with database-specific fields.
 */
@Entity('users')
export class UserEntity implements User {
  /** Unique identifier for the user (PostgreSQL auto-increment) */
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
