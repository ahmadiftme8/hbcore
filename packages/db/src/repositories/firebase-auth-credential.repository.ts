import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { FirebaseAuthCredentialEntity } from '../entities/users/firebase-auth-credential.entity.js';

/**
 * Repository for FirebaseAuthCredential entity operations.
 * Provides typed methods for common database operations on Firebase auth credentials.
 */
export class FirebaseAuthCredentialRepository {
  private repository: Repository<FirebaseAuthCredentialEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(FirebaseAuthCredentialEntity);
  }

  /**
   * Find a credential by ID
   */
  async findById(id: number): Promise<FirebaseAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'metadata', 'customClaims'],
    });
  }

  /**
   * Find a credential by user ID
   */
  async findByUserId(userId: number): Promise<FirebaseAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user', 'metadata', 'customClaims'],
    });
  }

  /**
   * Find a credential by Firebase UID
   */
  async findByFirebaseUid(firebaseUid: string): Promise<FirebaseAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: { firebaseUid },
      relations: ['user', 'metadata', 'customClaims'],
    });
  }

  /**
   * Find credentials by criteria
   */
  async find(where?: Partial<FirebaseAuthCredentialEntity>): Promise<FirebaseAuthCredentialEntity[]> {
    return this.repository.find({
      where: where as any,
      relations: ['user', 'metadata', 'customClaims'],
    });
  }

  /**
   * Find one credential by criteria
   */
  async findOne(where: Partial<FirebaseAuthCredentialEntity>): Promise<FirebaseAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: where as any,
      relations: ['user', 'metadata', 'customClaims'],
    });
  }

  /**
   * Create a new credential
   */
  async create(data: Partial<FirebaseAuthCredentialEntity>): Promise<FirebaseAuthCredentialEntity> {
    const credential = this.repository.create(data);
    return this.repository.save(credential);
  }

  /**
   * Save a credential entity
   */
  async save(credential: FirebaseAuthCredentialEntity): Promise<FirebaseAuthCredentialEntity> {
    return this.repository.save(credential);
  }

  /**
   * Update a credential by ID
   */
  async update(id: number, data: Partial<FirebaseAuthCredentialEntity>): Promise<void> {
    // Exclude relation properties from update data
    const { user, metadata, customClaims, ...updateData } = data;
    await this.repository.update(id, updateData as any);
  }

  /**
   * Delete a credential by ID (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * Get the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<FirebaseAuthCredentialEntity> {
    return this.repository;
  }
}
