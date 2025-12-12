import type { Phone, PhoneAuthCredentialId, UserId } from '@hbcore/types';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { PhoneAuthCredentialEntity } from '../entities/users/phone-auth-credential.entity.js';

/**
 * Repository for PhoneAuthCredential entity operations.
 * Provides typed methods for common database operations on phone auth credentials.
 */
export class PhoneAuthCredentialRepository {
  private repository: Repository<PhoneAuthCredentialEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(PhoneAuthCredentialEntity);
  }

  /**
   * Find a credential by ID
   */
  async findById(id: PhoneAuthCredentialId): Promise<PhoneAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  /**
   * Find a credential by user ID
   */
  async findByUserId(userId: UserId): Promise<PhoneAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  /**
   * Find a credential by phone number
   */
  async findByPhone(phone: Phone): Promise<PhoneAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: { phone },
      relations: ['user'],
    });
  }

  /**
   * Find credentials by criteria
   */
  async find(where?: Partial<PhoneAuthCredentialEntity>): Promise<PhoneAuthCredentialEntity[]> {
    return this.repository.find({
      where: where as any,
      relations: ['user'],
    });
  }

  /**
   * Find one credential by criteria
   */
  async findOne(where: Partial<PhoneAuthCredentialEntity>): Promise<PhoneAuthCredentialEntity | null> {
    return this.repository.findOne({
      where: where as any,
      relations: ['user'],
    });
  }

  /**
   * Create a new credential
   */
  async create(data: Partial<PhoneAuthCredentialEntity>): Promise<PhoneAuthCredentialEntity> {
    const credential = this.repository.create(data);
    return this.repository.save(credential);
  }

  /**
   * Save a credential entity
   */
  async save(credential: PhoneAuthCredentialEntity): Promise<PhoneAuthCredentialEntity> {
    return this.repository.save(credential);
  }

  /**
   * Update a credential by ID
   */
  async update(id: PhoneAuthCredentialId, data: Partial<PhoneAuthCredentialEntity>): Promise<void> {
    // Exclude relation properties from update data
    const { user, ...updateData } = data;
    await this.repository.update(id, updateData as any);
  }

  /**
   * Delete a credential by ID (soft delete)
   */
  async delete(id: PhoneAuthCredentialId): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * Get the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<PhoneAuthCredentialEntity> {
    return this.repository;
  }
}
