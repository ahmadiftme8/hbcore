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
import type { FirebaseAuthCredentialEntity } from './firebase-auth-credential.entity';

/**
 * Firebase user metadata entity.
 * Stores additional Firebase user information from the Firebase ecosystem.
 */
@Entity('firebase_user_metadata')
export class FirebaseUserMetadataEntity {
  /** Unique identifier for the metadata record */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Reference to the Firebase auth credential */
  @OneToOne(() => require('./firebase-auth-credential.entity').FirebaseAuthCredentialEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'firebase_auth_credential_id' })
  credential!: FirebaseAuthCredentialEntity;

  /** Firebase auth credential ID (foreign key) */
  @Column({ name: 'firebase_auth_credential_id', unique: true })
  firebaseAuthCredentialId!: number;

  /** Whether the user's email is verified in Firebase */
  @Column({ type: 'boolean', name: 'email_verified', default: false })
  emailVerified!: boolean;

  /** Whether the user account is disabled in Firebase */
  @Column({ type: 'boolean', name: 'disabled', default: false })
  disabled!: boolean;

  /** Firebase user creation timestamp */
  @Column({ type: 'timestamp', name: 'firebase_created_at', nullable: true })
  firebaseCreatedAt?: Date | null;

  /** Firebase user last sign-in timestamp */
  @Column({ type: 'timestamp', name: 'firebase_last_sign_in_at', nullable: true })
  firebaseLastSignInAt?: Date | null;

  /** Additional Firebase user metadata as JSON */
  @Column({ type: 'jsonb', name: 'additional_metadata', nullable: true })
  additionalMetadata?: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
