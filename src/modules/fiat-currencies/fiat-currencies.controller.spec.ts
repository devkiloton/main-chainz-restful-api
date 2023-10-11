import { Test, TestingModule } from '@nestjs/testing';
import { FiatCurrenciesController } from './fiat-currencies.controller';
import { FiatCurrenciesService } from './fiat-currencies.service';

describe('FiatCurrenciesController', () => {
  let controller: FiatCurrenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiatCurrenciesController],
      providers: [FiatCurrenciesService],
    }).compile();

    controller = module.get<FiatCurrenciesController>(FiatCurrenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
