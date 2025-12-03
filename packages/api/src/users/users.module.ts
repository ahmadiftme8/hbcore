import { FirebaseAuthCredentialRepository, UserProfileRepository, UserRepository } from '@hbcore/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { DatabaseService } from '@/database/database.providers';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseService,
    {
      provide: UserRepository,
      useFactory: (databaseService: DatabaseService) => databaseService.userRepository,
      inject: [DatabaseService],
    },
    {
      provide: UserProfileRepository,
      useFactory: (databaseService: DatabaseService) => databaseService.userProfileRepository,
      inject: [DatabaseService],
    },
    {
      provide: FirebaseAuthCredentialRepository,
      useFactory: (databaseService: DatabaseService) => databaseService.firebaseAuthCredentialRepository,
      inject: [DatabaseService],
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
