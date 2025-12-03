import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { FirebaseUserMetadataEntity } from '../entities/users/firebase-user-metadata.entity.js';

/**
 * Repository for FirebaseUserMetadata entity operations.
 * Provides typed methods for common database operations on Firebase user metadata.
 */
export class FirebaseUserMetadataRepository {
  private repository: Repository<FirebaseUserMetadataEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(FirebaseUserMetadataEntity);
  }

  /**
   * Find metadata by ID
   */
  async findById(id: number): Promise<FirebaseUserMetadataEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['credential'],
    });
  }

  /**
   * Find metadata by Firebase auth credential ID
   */
  async findByCredentialId(firebaseAuthCredentialId: number): Promise<FirebaseUserMetadataEntity | null> {
    return this.repository.findOne({
      where: { firebaseAuthCredentialId },
      relations: ['credential'],
    });
  }

  /**
   * Find metadata by criteria
   */
  async find(where?: Partial<FirebaseUserMetadataEntity>): Promise<FirebaseUserMetadataEntity[]> {
    return this.repository.find({
      where: where as any,
      relations: ['credential'],
    });
  }

  /**
   * Find one metadata by criteria
   */
  async findOne(where: Partial<FirebaseUserMetadataEntity>): Promise<FirebaseUserMetadataEntity | null> {
    return this.repository.findOne({
      where: where as any,
      relations: ['credential'],
    });
  }

  /**
   * Create new metadata
   */
  async create(data: Partial<FirebaseUserMetadataEntity>): Promise<FirebaseUserMetadataEntity> {
    const metadata = this.repository.create(data);
    return this.repository.save(metadata);
  }

  /**
   * Save metadata entity
   */
  async save(metadata: FirebaseUserMetadataEntity): Promise<FirebaseUserMetadataEntity> {
    return this.repository.save(metadata);
  }

  /**
   * Update metadata by ID
   */
  async update(id: number, data: Partial<FirebaseUserMetadataEntity>): Promise<void> {
    // Exclude relation properties from update data
    const { credential, ...updateData } = data;
    await this.repository.update(id, updateData as any);
  }

  /**
   * Delete metadata by ID (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * Get the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<FirebaseUserMetadataEntity> {
    return this.repository;
  }
}
