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
import { FirebaseAuthCredentialEntity } from './firebase-auth-credential.entity';

/**
 * Firebase custom claims entity.
 * Stores custom claims associated with Firebase users.
 */
@Entity('firebase_custom_claims')
export class FirebaseCustomClaimsEntity {
  /** Unique identifier for the custom claim record */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Reference to the Firebase auth credential */
  @ManyToOne(
    () => FirebaseAuthCredentialEntity,
    (credential) => credential.customClaims,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'firebase_auth_credential_id' })
  credential!: FirebaseAuthCredentialEntity;

  /** Firebase auth credential ID (foreign key) */
  @Column({ name: 'firebase_auth_credential_id' })
  firebaseAuthCredentialId!: number;

  /** Claim key */
  @Column({ type: 'varchar', length: 255 })
  claimKey!: string;

  /** Claim value (stored as JSON) */
  @Column({ type: 'jsonb', name: 'claim_value' })
  claimValue!: unknown;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
