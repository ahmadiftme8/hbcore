import {
  createDataSource,
  type DataSource,
  FirebaseAuthCredentialEntity,
  FirebaseAuthCredentialRepository,
  FirebaseCustomClaimsEntity,
  FirebaseCustomClaimsRepository,
  FirebaseUserMetadataEntity,
  FirebaseUserMetadataRepository,
  UserEntity,
  UserProfileEntity,
  UserProfileRepository,
  UserRepository,
} from '@hbcore/db';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';

/**
 * Database service that manages DataSource and repositories.
 * Initializes the database connection and provides repository instances.
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dataSource: DataSource | null = null;
  public readonly userRepository: UserRepository;
  public readonly userProfileRepository: UserProfileRepository;
  public readonly firebaseAuthCredentialRepository: FirebaseAuthCredentialRepository;
  public readonly firebaseUserMetadataRepository: FirebaseUserMetadataRepository;
  public readonly firebaseCustomClaimsRepository: FirebaseCustomClaimsRepository;

  constructor(private readonly configService: ConfigService) {
    // Initialize DataSource with entities passed directly for better compatibility
    const config = this.configService.e;
    this.dataSource = createDataSource(
      {
        host: config.POSTGRES_HOST,
        port: Number(config.POSTGRES_PORT),
        username: config.POSTGRES_USER,
        password: config.POSTGRES_PASSWORD,
        database: config.POSTGRES_NAME,
      },
      {
        entities: [
          UserEntity,
          UserProfileEntity,
          FirebaseAuthCredentialEntity,
          FirebaseUserMetadataEntity,
          FirebaseCustomClaimsEntity,
        ],
      },
    );

    // Initialize repositories
    this.userRepository = new UserRepository(this.dataSource);
    this.userProfileRepository = new UserProfileRepository(this.dataSource);
    this.firebaseAuthCredentialRepository = new FirebaseAuthCredentialRepository(this.dataSource);
    this.firebaseUserMetadataRepository = new FirebaseUserMetadataRepository(this.dataSource);
    this.firebaseCustomClaimsRepository = new FirebaseCustomClaimsRepository(this.dataSource);
  }

  async onModuleInit() {
    if (!this.dataSource?.isInitialized) {
      await this.dataSource?.initialize();
    }
  }

  async onModuleDestroy() {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  /**
   * Get the underlying DataSource instance
   */
  getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error('DataSource not initialized');
    }
    return this.dataSource;
  }
}
