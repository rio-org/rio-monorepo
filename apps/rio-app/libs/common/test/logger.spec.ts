import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LoggerModule, LoggerService, LoggerModuleOptions } from '../src';

describe('Logger Tests', () => {
  let app: INestApplication;

  const createApp = async (options: LoggerModuleOptions) => {
    app = (
      await Test.createTestingModule({
        imports: [
          LoggerModule.forRoot({
            ...options,
          }),
        ],
      }).compile()
    ).createNestApplication();
    await app.init();
  };

  afterEach(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  describe('Log level', () => {
    it('should print log', async () => {
      const message = 'random message';
      const context = 'RandomContext';
      await createApp({ general: { context } });
      const logger = await app.resolve(LoggerService);
      const spy = jest.spyOn(logger, 'log');

      logger.log(message);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(message);

      spy.mockRestore();
    });

    it('should not print context if not provided', async () => {
      const message = 'random message';
      await createApp({});
      const logger = await app.resolve(LoggerService);
      const spy = jest.spyOn(logger, 'log');

      logger.log(message);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(message);

      spy.mockRestore();
    });
  });

  describe('Error level', () => {
    it('should print errors', async () => {
      const message = 'random message';
      const context = 'RandomContext';
      await createApp({ general: { context } });
      const logger = await app.resolve(LoggerService);
      const spy = jest.spyOn(logger, 'error');
      logger.error(message);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(message);

      spy.mockRestore();
    });
  });
});
