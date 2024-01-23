import {
  hasDuplicatePubkeys,
  hasDuplicateSigs,
  isHexadecimal
} from './utilities';

const asError = (e: unknown) => e as Error;

export const validateOperatorKeys = ({ json }: { json: string }) => {
  let data;
  try {
    data = JSON.parse(json);
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array');
    }
  } catch (e) {
    throw new Error(asError(e).message || 'Invalid JSON');
  }

  const quantity = data.length;
  if (quantity < 1) {
    throw new Error(`Expected one or more keys but got ${quantity}.`);
  }

  // if (quantity > LIMIT) {
  //   throw new Error(`Expected ${LIMIT} signing keys max per submission but got ${quantity}.`);
  // }

  if (hasDuplicatePubkeys(data)) {
    throw new Error('Includes duplicate public keys');
  }

  if (hasDuplicateSigs(data)) {
    throw new Error('Includes duplicate signatures');
  }

  for (let i = 0; i < data.length; i++) {
    const { pubkey, signature } = data[i];
    if (!isHexadecimal(pubkey, 96))
      throw new Error(`Invalid pubkey at index ${i}.`);
    if (!isHexadecimal(signature, 192))
      throw new Error(`Invalid signature at index ${i}.`);
  }

  return true;
};
