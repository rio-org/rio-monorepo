import { ValidationOptions, buildMessage, ValidateBy } from 'class-validator';

export const IS_ETHEREUM_TRANSACTION_HASH = 'isEthereumTransactionHash';

/**
 * Check if the string is an Ethereum transaction hash using basic regex. Does not validate transaction hash checksums.
 * If given value is not a string, then it returns false.
 */
export function isEthereumTransactionHash(value: unknown): boolean {
  const ethereumTransactionHash = /^(0x)[0-9a-f]{64}$/i;
  return (
    (typeof value === 'string' || value instanceof String) &&
    ethereumTransactionHash.test(value.toString())
  );
}

/**
 * Check if the string is an Ethereum transaction hash using basic regex. Does not validate transaction hash checksums.
 * If given value is not a string, then it returns false.
 */
export function IsEthereumTransactionHash(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ETHEREUM_TRANSACTION_HASH,
      validator: {
        validate: (value): boolean => isEthereumTransactionHash(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property must be an Ethereum transaction hash',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
``;
