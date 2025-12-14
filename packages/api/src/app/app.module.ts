import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@/config/config.module';
import { FirebaseModule } from '@/firebase/firebase.module';
import { RedisModule } from '@/redis/redis.module';
import { UnleashModule } from '@/unleash/unleash.module';
import { UsersModule } from '@/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, RedisModule, FirebaseModule, UsersModule, AuthModule, UnleashModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
