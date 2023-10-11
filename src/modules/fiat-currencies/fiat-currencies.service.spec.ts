import { Test, TestingModule } from '@nestjs/testing';
import { FiatCurrenciesService } from './fiat-currencies.service';

describe('FiatCurrenciesService', () => {
  let service: FiatCurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiatCurrenciesService],
    }).compile();

    service = module.get<FiatCurrenciesService>(FiatCurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
