import {
  createDataSource,
  type DataSource,
  FirebaseAuthCredentialEntity,
  FirebaseAuthCredentialRepository,
  FirebaseCustomClaimsEntity,
  FirebaseCustomClaimsRepository,
  FirebaseUserMetadataEntity,
  FirebaseUserMetadataRepository,
  PhoneAuthCredentialEntity,
  PhoneAuthCredentialRepository,
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
  public readonly phoneAuthCredentialRepository: PhoneAuthCredentialRepository;

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
          PhoneAuthCredentialEntity,
        ],
      },
    );

    // Initialize repositories
    this.userRepository = new UserRepository(this.dataSource);
    this.userProfileRepository = new UserProfileRepository(this.dataSource);
    this.firebaseAuthCredentialRepository = new FirebaseAuthCredentialRepository(this.dataSource);
    this.firebaseUserMetadataRepository = new FirebaseUserMetadataRepository(this.dataSource);
    this.firebaseCustomClaimsRepository = new FirebaseCustomClaimsRepository(this.dataSource);
    this.phoneAuthCredentialRepository = new PhoneAuthCredentialRepository(this.dataSource);
  }

  async onModuleInit() {
    if (!this.dataSource?.isInitialized) {
      try {
        await this.dataSource?.initialize();
      } catch (error) {
        console.error('💥 Failed to initialize database connection:');
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        } else {
          console.error('Error:', error);
        }
        const config = this.configService.e;
        console.error('Database configuration:');
        console.error(`  Host: ${config.POSTGRES_HOST}`);
        console.error(`  Port: ${config.POSTGRES_PORT}`);
        console.error(`  Database: ${config.POSTGRES_NAME}`);
        console.error(`  User: ${config.POSTGRES_USER}`);
        console.error(`  SSL: ${config.POSTGRES_SSL}`);
        throw error;
      }
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
