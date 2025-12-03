import { AuthProvider, type FirebaseAuthCredential } from '@hbcore/types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FirebaseCustomClaimsEntity } from './firebase-custom-claims.entity';
import { FirebaseUserMetadataEntity } from './firebase-user-metadata.entity';
import { UserEntity } from './user.entity';

/**
 * Firebase authentication credential entity.
 * Stores Firebase-specific authentication data separately from user profile data.
 */
@Entity('firebase_auth_credentials')
export class FirebaseAuthCredentialEntity implements FirebaseAuthCredential {
  /** Unique identifier for the credential record */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Reference to the user */
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  /** User ID (foreign key) */
  @Column({ name: 'user_id' })
  userId!: number;

  /** Authentication provider (always 'firebase' for this entity) */
  @Column({ type: 'varchar', length: 20, name: 'provider', default: AuthProvider.FIREBASE })
  provider!: AuthProvider.FIREBASE;

  /** Firebase UID (unique identifier from Firebase) */
  @Column({ type: 'varchar', length: 128, name: 'firebase_uid', unique: true })
  firebaseUid!: string;

  /** Firebase user metadata */
  @OneToOne(
    () => FirebaseUserMetadataEntity,
    (metadata) => metadata.credential,
  )
  metadata?: FirebaseUserMetadataEntity;

  /** Firebase custom claims */
  customClaims?: FirebaseCustomClaimsEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
