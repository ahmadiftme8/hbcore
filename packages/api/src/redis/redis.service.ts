import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis, { type RedisOptions } from 'ioredis';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;
  private hasLoggedConnection = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const config = this.configService.e;
    const redisUrl = config.REDIS_URL;

    // Configure TLS if using rediss:// protocol
    const isTLS = redisUrl.startsWith('rediss://');
    const redisOptions: RedisOptions = {
      connectTimeout: 10000, // 10 second connection timeout
      commandTimeout: 10000, // 10 second command timeout (increased for remote connections)
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      enableOfflineQueue: true, // Allow commands to queue while connecting
    };

    // Add TLS configuration for rediss:// URLs
    if (isTLS) {
      redisOptions.tls = {
        rejectUnauthorized: false, // Allow self-signed certificates
      };
    }

    this.client = new Redis(redisUrl, redisOptions);

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.client.on('connect', () => {
      // Only log the first successful connection to avoid duplicate logs
      if (!this.hasLoggedConnection) {
        console.log('Redis connected successfully');
        this.hasLoggedConnection = true;
      }
    });

    // Wait for the connection to be ready
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    // If already ready, return immediately
    if (this.client.status === 'ready') {
      return;
    }

    // Wait for ready event with timeout
    await new Promise<void>((resolve, reject) => {
      if (!this.client) {
        reject(new Error('Redis client not initialized'));
        return;
      }

      const timeout = setTimeout(() => {
        if (this.client) {
          this.client.removeListener('error', onError);
          this.client.removeListener('ready', onReady);
        }
        reject(new Error('Redis connection timeout'));
      }, 8000); // 8 second timeout for initial connection

      const onReady = () => {
        clearTimeout(timeout);
        if (this.client) {
          this.client.removeListener('error', onError);
        }
        resolve();
      };

      const onError = (error: Error) => {
        clearTimeout(timeout);
        if (this.client) {
          this.client.removeListener('ready', onReady);
        }
        reject(error);
      };

      // Check status again in case it became ready between checks
      if (this.client.status === 'ready') {
        clearTimeout(timeout);
        resolve();
        return;
      }

      this.client.once('ready', onReady);
      this.client.once('error', onError);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  /**
   * Get the Redis client instance
   */
  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    return this.client;
  }

  /**
   * Get a value by key
   * @returns The value or null if key doesn't exist or Redis is unavailable
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.getClient().get(key);
    } catch (error) {
      console.warn('Redis get operation failed:', error instanceof Error ? error.message : String(error));
      return null; // Return null on error (treat as key not found)
    }
  }

  /**
   * Set a value with optional expiration
   * @returns true if successful, false if Redis is unavailable
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (ttlSeconds) {
        await this.getClient().setex(key, ttlSeconds, value);
      } else {
        await this.getClient().set(key, value);
      }
      return true;
    } catch (error) {
      console.warn('Redis set operation failed:', error instanceof Error ? error.message : String(error));
      return false; // Return false on error
    }
  }

  /**
   * Delete a key
   * @returns true if successful, false if Redis is unavailable
   */
  async del(key: string): Promise<boolean> {
    try {
      await this.getClient().del(key);
      return true;
    } catch (error) {
      console.warn('Redis del operation failed:', error instanceof Error ? error.message : String(error));
      return false; // Return false on error
    }
  }

  /**
   * Increment a counter
   * @returns The new count, or 0 if Redis is unavailable
   */
  async incr(key: string): Promise<number> {
    try {
      return await this.getClient().incr(key);
    } catch (error) {
      console.warn('Redis incr operation failed:', error instanceof Error ? error.message : String(error));
      return 0; // Return 0 on error (treat as no count)
    }
  }

  /**
   * Set expiration on a key
   * @returns true if successful, false if Redis is unavailable
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      await this.getClient().expire(key, seconds);
      return true;
    } catch (error) {
      console.warn('Redis expire operation failed:', error instanceof Error ? error.message : String(error));
      return false; // Return false on error
    }
  }

  /**
   * Get the remaining TTL (time to live) of a key in seconds
   * @returns TTL in seconds, -1 if key exists but has no expiration, -2 if key doesn't exist, -2 if Redis is unavailable
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.getClient().ttl(key);
    } catch (error) {
      console.warn('Redis ttl operation failed:', error instanceof Error ? error.message : String(error));
      return -2; // Return -2 on error (treat as key doesn't exist)
    }
  }

  /**
   * Check if a key exists
   * @returns true if key exists, false otherwise or if Redis is unavailable
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.getClient().exists(key);
      return result === 1;
    } catch (error) {
      console.warn('Redis exists operation failed:', error instanceof Error ? error.message : String(error));
      return false; // Return false on error (treat as key doesn't exist)
    }
  }
}
