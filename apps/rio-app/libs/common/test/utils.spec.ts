import { DateService, ValidationService } from '../src/';

describe('Utils Tests', () => {
  describe('DateService', () => {
    const dateString = '12-5-2021';
    const date = new Date(dateString);
    const dateService = new DateService();

    it('should format a Date into a string with dashes', () => {
      const expected = '2021-12-5';
      expect(dateService.formatYearMonthDay(date)).toMatch(expected);
    });

    it('should format a Date into a string with dashes and add zero padding', () => {
      const expected = '2021-12-05';
      expect(dateService.formatYearMonthDay(date, true)).toMatch(expected);
    });

    it('should format a Date into a string with slashes and include the day of week', () => {
      const expected = '12/5/2021 Sunday';
      expect(dateService.formatMonthDayYearFullDay(date)).toMatch(expected);
    });

    it('should return the day of week', () => {
      const expected = 'Sunday';
      expect(dateService.getDayOfWeek('2021-12-5')).toMatch(expected);
    });
  });

  describe('ValidationService', () => {
    const validationService = new ValidationService();
    it('should validate UUID string', () => {
      expect(
        validationService.isValidUUID('123e4567-e89b-12d3-a456-426614174000'),
      ).toBeTruthy();
      expect(validationService.isValidUUID('123e45fail174000')).toBeFalsy();
    });

    it('should validate hex string', () => {
      expect(validationService.isValidHex('0xDEADBEEF')).toBeTruthy();
      expect(validationService.isValidHex('0xDEADBEEG')).toBeFalsy();
      expect(validationService.isValidHex('DEADBEEF')).toBeTruthy();
      expect(validationService.isValidHex('DEADBEEG')).toBeFalsy();
    });

    it('should validate hex transaction string', () => {
      expect(
        validationService.isValidTransactionHash(
          '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF',
        ),
      ).toBeTruthy();
      expect(
        validationService.isValidTransactionHash(
          '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEG',
        ),
      ).toBeFalsy();
      expect(
        validationService.isValidTransactionHash(
          'DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF',
        ),
      ).toBeFalsy();
      expect(validationService.isValidTransactionHash('0xABC123')).toBeFalsy();
    });

    it('should validate past timestamp', () => {
      const date = new Date('12-5-2021');
      expect(validationService.isPastTimestamp(date)).toBeTruthy;
      expect(validationService.isPastTimestamp(Date.now() + 100)).toBeFalsy;
    });
  });
});
