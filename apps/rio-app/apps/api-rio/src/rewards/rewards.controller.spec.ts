import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

describe('ApiController', () => {
  let appController: RewardsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [RewardsService],
    }).compile();

    appController = app.get<RewardsController>(RewardsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getTime()).toBe('Hello World!');
    });
  });
});
