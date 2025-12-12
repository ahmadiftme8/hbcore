import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@/config/config.module';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    await service.onModuleInit();
  }, 10000); // 10 second timeout for Redis connection

  afterAll(async () => {
    if (service) {
      await service.onModuleDestroy();
    }
    if (module) {
      await module.close();
    }
  });

  describe('Connection', () => {
    it('should establish Redis connection', async () => {
      expect(service).toBeDefined();
      expect(() => service.getClient()).not.toThrow();
      const client = service.getClient();
      expect(client).toBeDefined();

      // Verify connection by pinging Redis
      const pingResult = await client.ping();
      expect(pingResult).toBe('PONG');
    });
  });

  describe('Operations', () => {
    const testKey = `test:${Date.now()}:${Math.random()}`;
    const testValue = 'test-value';

    afterEach(async () => {
      // Clean up test key after each test
      await service.del(testKey);
    });

    it('should set a value', async () => {
      const result = await service.set(testKey, testValue);
      expect(result).toBe(true);
    });

    it('should get a value after setting', async () => {
      await service.set(testKey, testValue);
      const value = await service.get(testKey);
      expect(value).toBe(testValue);
    });

    it('should delete a key', async () => {
      await service.set(testKey, testValue);
      const deleteResult = await service.del(testKey);
      expect(deleteResult).toBe(true);
    });

    it('should return null after deleting a key', async () => {
      await service.set(testKey, testValue);
      await service.del(testKey);
      const value = await service.get(testKey);
      expect(value).toBeNull();
    });

    it('should perform set → get → del → get sequence correctly', async () => {
      // Set
      const setResult = await service.set(testKey, testValue);
      expect(setResult).toBe(true);

      // Get after set
      const valueAfterSet = await service.get(testKey);
      expect(valueAfterSet).toBe(testValue);

      // Delete
      const delResult = await service.del(testKey);
      expect(delResult).toBe(true);

      // Get after delete (should return null)
      const valueAfterDel = await service.get(testKey);
      expect(valueAfterDel).toBeNull();
    });
  });
});
