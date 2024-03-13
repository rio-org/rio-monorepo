import { UseQueryResult } from '@tanstack/react-query';
import {
  Config,
  UseBalanceParameters,
  UseBalanceReturnType,
  useBalance
} from 'wagmi';

export function useLocaleBalance(
  config?: UseBalanceParameters,
  localeStringOptions: Parameters<typeof Number.prototype.toLocaleString>[1] = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }
): Omit<UseBalanceReturnType, 'data' | 'refetch'> & {
  data:
    | {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
        locale: string;
      }
    | undefined;
  refetch: UseQueryResult<UseBalanceReturnType['data'], unknown>['refetch'];
} {
  const { data, ...rest } = useBalance<Config, UseBalanceReturnType['data']>(
    config
  );
  const tempNumber = Number(data?.formatted || 0);
  const opts = {
    ...localeStringOptions,
    maximumFractionDigits:
      tempNumber > 100
        ? 0
        : tempNumber > 10
        ? 1
        : tempNumber > 1
        ? 2
        : localeStringOptions.maximumFractionDigits
  };
  return {
    ...rest,
    data: !data
      ? undefined
      : {
          ...data,
          locale: Number(data.formatted).toLocaleString(undefined, opts)
        }
  };
}
