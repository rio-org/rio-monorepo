import { BigNumber } from 'bignumber.js';

/**
 * Common configuration for all applications
 */
export const configure = (): void => {
  // By default, BigNumber's `toString` method converts to exponential notation if the value has
  // more than 20 digits. We want to avoid this behavior, so we set EXPONENTIAL_AT to a high number.
  BigNumber.config({
    EXPONENTIAL_AT: 1000,
  });
};
