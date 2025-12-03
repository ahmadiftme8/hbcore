import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users/user.entity.js';

/**
 * Repository for User entity operations.
 * Provides typed methods for common database operations on users.
 */
export class UserRepository {
  private repository: Repository<UserEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  /**
   * Find a user by ID
   */
  async findById(id: number): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Find users by criteria
   */
  async find(where?: Partial<UserEntity>): Promise<UserEntity[]> {
    return this.repository.find({
      where: where as any,
    });
  }

  /**
   * Find one user by criteria
   */
  async findOne(where: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: where as any,
    });
  }

  /**
   * Create a new user
   */
  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  /**
   * Save a user entity
   */
  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  /**
   * Update a user by ID
   */
  async update(id: number, data: Partial<UserEntity>): Promise<void> {
    await this.repository.update(id, data);
  }

  /**
   * Delete a user by ID (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * Get the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<UserEntity> {
    return this.repository;
  }
}
