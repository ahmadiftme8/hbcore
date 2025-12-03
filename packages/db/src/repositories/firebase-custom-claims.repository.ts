import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { FirebaseCustomClaimsEntity } from '../entities/users/firebase-custom-claims.entity.js';

/**
 * Repository for FirebaseCustomClaims entity operations.
 * Provides typed methods for common database operations on Firebase custom claims.
 */
export class FirebaseCustomClaimsRepository {
  private repository: Repository<FirebaseCustomClaimsEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(FirebaseCustomClaimsEntity);
  }

  /**
   * Find a claim by ID
   */
  async findById(id: number): Promise<FirebaseCustomClaimsEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['credential'],
    });
  }

  /**
   * Find claims by Firebase auth credential ID
   */
  async findByCredentialId(firebaseAuthCredentialId: number): Promise<FirebaseCustomClaimsEntity[]> {
    return this.repository.find({
      where: { firebaseAuthCredentialId },
      relations: ['credential'],
    });
  }

  /**
   * Find a claim by credential ID and claim key
   */
  async findByCredentialIdAndKey(
    firebaseAuthCredentialId: number,
    claimKey: string,
  ): Promise<FirebaseCustomClaimsEntity | null> {
    return this.repository.findOne({
      where: { firebaseAuthCredentialId, claimKey },
      relations: ['credential'],
    });
  }

  /**
   * Find claims by criteria
   */
  async find(where?: Partial<FirebaseCustomClaimsEntity>): Promise<FirebaseCustomClaimsEntity[]> {
    return this.repository.find({
      where: where as any,
      relations: ['credential'],
    });
  }

  /**
   * Find one claim by criteria
   */
  async findOne(where: Partial<FirebaseCustomClaimsEntity>): Promise<FirebaseCustomClaimsEntity | null> {
    return this.repository.findOne({
      where: where as any,
      relations: ['credential'],
    });
  }

  /**
   * Create a new claim
   */
  async create(data: Partial<FirebaseCustomClaimsEntity>): Promise<FirebaseCustomClaimsEntity> {
    const claim = this.repository.create(data);
    return this.repository.save(claim);
  }

  /**
   * Save a claim entity
   */
  async save(claim: FirebaseCustomClaimsEntity): Promise<FirebaseCustomClaimsEntity> {
    return this.repository.save(claim);
  }

  /**
   * Update a claim by ID
   */
  async update(id: number, data: Partial<FirebaseCustomClaimsEntity>): Promise<void> {
    // Exclude relation properties from update data
    const { credential, ...updateData } = data;
    await this.repository.update(id, updateData as any);
  }

  /**
   * Delete a claim by ID (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * Delete claims by credential ID
   */
  async deleteByCredentialId(firebaseAuthCredentialId: number): Promise<void> {
    await this.repository.softDelete({ firebaseAuthCredentialId });
  }

  /**
   * Get the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<FirebaseCustomClaimsEntity> {
    return this.repository;
  }
}
