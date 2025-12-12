import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@/config/config.module';
import { DatabaseService } from './database.providers';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    await service.onModuleInit();
  });

  afterAll(async () => {
    if (service) {
      await service.onModuleDestroy();
    }
    if (module) {
      await module.close();
    }
  });

  describe('Connection', () => {
    it('should establish Postgres connection', () => {
      expect(service).toBeDefined();
      expect(() => service.getDataSource()).not.toThrow();
      const dataSource = service.getDataSource();
      expect(dataSource).toBeDefined();
      expect(dataSource.isInitialized).toBe(true);
    });
  });
});

