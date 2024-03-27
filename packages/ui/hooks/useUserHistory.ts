import { useGetDeposits } from './useGetDeposits';
import { useGetWithdrawalClaims } from './useGetWithdrawalClaims';
import { useGetAccountWithdrawals } from './useGetAccountWithdrawals';
import { useCallback, useMemo } from 'react';
import { type UseQueryResult } from '@tanstack/react-query';
import { Address } from 'viem';
import {
  BaseAssetDetails,
  TransactionEvent,
  TransactionType
} from '../lib/typings';
import { useGetLiquidRestakingTokens } from './useGetLiquidRestakingTokens';
import {
  asType,
  dateFromTimestamp,
  parseBaseSubgraphAsset
} from '../lib/utilities';
import {
  Deposit,
  WithdrawalClaim,
  WithdrawalRequest
} from '@rionetwork/sdk-react';
import { useGetAssetsList } from './useGetAssetsList';

interface RawTransactionEvent<
  T extends 'Incomplete' | void = void,
  R extends TransactionType = T extends 'Incomplete'
    ? TransactionType.Claim
    : TransactionType.Request | TransactionType.Deposit
> extends Omit<TransactionEvent, 'type' | 'userBalanceAfter'> {
  type: R;
  userBalanceAfter: T extends void ? number : never;
}

export const useTransactionHistory = (config?: {
  where: { sender?: string; restakingToken?: string };
}) => {
  const { data: claims, ...claimsValues } = useGetWithdrawalClaims(config);
  const { data: deposits, ...depositsValues } = useGetDeposits(config);
  const { data: requests, ...requestsValues } =
    useGetAccountWithdrawals(config);
  const { data: lrtList, ...lrtListValues } = useGetLiquidRestakingTokens();
  const { data: assetList } = useGetAssetsList();
  const withdrawalRequests = requests.withdrawalRequests;

  const lrtLookup = useMemo(() => {
    if (!lrtList?.length) return null;
    return lrtList.reduce(
      (acc, lrt) => {
        acc[lrt.address] = parseBaseSubgraphAsset(lrt);
        return acc;
      },
      {} as Record<Address, BaseAssetDetails>
    );
  }, [lrtList?.map(lrt => lrt.address)]);

  const assetLookup = useMemo(() => {
    if (!assetList?.length) return null;
    return assetList.reduce(
      (acc, asset) => {
        acc[asset.address] = parseBaseSubgraphAsset(asset);
        return acc;
      },
      {} as Record<Address, BaseAssetDetails>
    );
  }, [assetList?.map(asset => asset.address)]);

  const txHistory = useMemo(() => {
    if (
      !deposits ||
      !claims ||
      !withdrawalRequests ||
      !lrtLookup ||
      !assetLookup
    ) {
      return null;
    }

    let last = 0;
    const parseTx = buildParseTx(lrtLookup, assetLookup);
    const txEvents: TransactionEvent[] = [];

    return txEvents
      .concat(parseTx(deposits))
      .concat(parseTx(claims))
      .concat(parseTx(withdrawalRequests))
      .sort((a, b) => +a.date - +b.date)
      .map((tx) => {
        if (tx.type !== TransactionType.Claim) {
          last = Number(tx.userBalanceAfter ?? 0);
        }
        return {
          ...tx,
          date: dateFromTimestamp(+tx.date),
          userBalanceAfter: last
        };
      })
      .reverse();
  }, [deposits, claims, withdrawalRequests, lrtLookup]);

  const values = [
    claimsValues,
    requestsValues,
    depositsValues,
    lrtListValues
  ] as (Partial<UseQueryResult<unknown, Error>> & { refetch(): void })[];

  const refetch = useCallback(
    () => refetchAll(values),
    [
      claimsValues.refetch,
      requestsValues.refetch,
      depositsValues.refetch,
      lrtListValues.refetch
    ]
  );

  return {
    data: txHistory,
    error: findFirstTruthy(values, 'error') ?? null,
    isLoading: findFirstTruthy(values, 'isLoading') ?? false,
    isError: findFirstTruthy(values, 'isError') ?? false,
    isFetching: findFirstTruthy(values, 'isFetching') ?? false,
    isFetched: allAreTruthy(values, 'isFetched'),
    isSuccess: allAreTruthy(values, 'isSuccess'),
    refetch
  };
};

///////////
// helpers
///////////

function refetchAll(
  values: readonly (Partial<UseQueryResult<unknown, Error>> & {
    refetch(): void;
  })[]
) {
  values.forEach((v) => {
    v.refetch().catch((e) => console.error(`refetch error`, e));
  });
}
function allAreTruthy<T extends keyof UseQueryResult>(
  values: readonly Partial<UseQueryResult>[],
  field: T
): boolean {
  return values.every((v) => v[field]);
}

function findFirstTruthy<T extends keyof UseQueryResult>(
  values: readonly Partial<UseQueryResult>[],
  field: T
): Partial<UseQueryResult>[T] | undefined {
  return values.find((v) => v[field])?.[field];
}

function buildParseTx(
  lrtLookup: Record<Address, BaseAssetDetails>,
  assetLookup: Record<Address, BaseAssetDetails>
) {
  return <
    T extends Deposit | WithdrawalClaim | WithdrawalRequest,
    R extends 'Incomplete' | void = T extends WithdrawalClaim
      ? 'Incomplete'
      : void
  >(
    list: T[]
  ) => {
    return list.map((tx) => {
      const type =
        typeof (tx as WithdrawalClaim).amountClaimed !== 'undefined'
          ? TransactionType.Claim
          : typeof (tx as WithdrawalRequest).epochStatus !== 'undefined'
          ? TransactionType.Request
          : TransactionType.Deposit;
      const isClaim = type === TransactionType.Claim;
      const isRequest = type === TransactionType.Request;
      const _ctx = tx as WithdrawalClaim;
      const _dwtx = tx as Deposit | WithdrawalRequest;
      const _dtx = tx as Deposit;
      return {
        type,
        date: tx.timestamp,
        address: tx.sender,
        valueUSD: Number(tx.valueUSD),
        amountChange: Number(isClaim ? _ctx.amountClaimed : _dwtx.amountIn),
        amountChangeSymbol: isRequest
          ? lrtLookup[tx.restakingToken as Address]?.symbol
          : assetLookup[asType<Address>(isClaim ? _ctx.assetOut : _dtx.assetIn)]?.symbol,
        restakingToken: lrtLookup[tx.restakingToken as Address],
        restakingTokenPriceUSD: Number(tx.restakingTokenPriceUSD),
        tx: tx.tx,
        ...(!isClaim && {
          userBalanceAfter: Number(_dwtx.userBalanceAfter)
        })
      } as RawTransactionEvent<R>;
    });
  };
}
