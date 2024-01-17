import { useGetDeposits } from './useGetDeposits';
import { useGetWithdrawalClaims } from './useGetWithdrawalClaims';
import { useGetAccountWithdrawals } from './useGetAccountWithdrawals';
import { useCallback, useMemo } from 'react';
import { Address } from 'viem';
import {
  BaseAssetDetails,
  TransactionEvent,
  TransactionType
} from '../lib/typings';
import { useGetLiquidRestakingTokens } from './useGetLiquidRestakingTokens';
import { dateFromTimestamp, parseBaseSubgraphAsset } from '../lib/utilities';
import {
  Deposit,
  WithdrawalClaim,
  WithdrawalRequest
} from '@rionetwork/sdk-react';

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
  }, [lrtList?.length]);

  const txHistory = useMemo(() => {
    if (!deposits || !claims || !withdrawalRequests || !lrtLookup) {
      return null;
    }

    let last = 0;
    const parseTx = buildParseTx(lrtLookup);
    const txEvents: TransactionEvent[] = [];

    return txEvents
      .concat(parseTx(deposits))
      .concat(parseTx(claims))
      .concat(parseTx(withdrawalRequests))
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .map((tx) => {
        if (tx.type !== TransactionType.Claim) {
          last = Number(tx.userBalanceAfter ?? 0);
          console.log(last);
        }
        return { ...tx, userBalanceAfter: last };
      })
      .reverse();
  }, [deposits, claims, withdrawalRequests, lrtLookup]);

  const refetch = useCallback(() => {
    claimsValues.refetch().catch((e) => console.error('claimsValues error', e));
    requestsValues
      .refetch()
      .catch((e) => console.error('requestsValues error', e));
    depositsValues
      .refetch()
      .catch((e) => console.error('depositsValues error', e));
    lrtListValues
      .refetch()
      .catch((e) => console.error('lrtListValues error', e));
  }, [
    claimsValues.refetch,
    requestsValues.refetch,
    depositsValues.refetch,
    lrtListValues.refetch
  ]);

  return {
    data: txHistory,
    error:
      claimsValues.error ||
      requestsValues.error ||
      depositsValues.error ||
      lrtListValues.error,
    isLoading:
      claimsValues.isLoading ||
      requestsValues.isLoading ||
      depositsValues.isLoading ||
      lrtListValues.isLoading,
    isError:
      claimsValues.isError ||
      requestsValues.isError ||
      depositsValues.isError ||
      lrtListValues.isError,
    isFetching:
      claimsValues.isFetching ||
      requestsValues.isFetching ||
      depositsValues.isFetching ||
      lrtListValues.isFetching,
    isFetched:
      claimsValues.isFetched &&
      requestsValues.isFetched &&
      depositsValues.isFetched &&
      lrtListValues.isFetched,
    isSuccess:
      claimsValues.isSuccess &&
      requestsValues.isSuccess &&
      depositsValues.isSuccess &&
      lrtListValues.isSuccess,
    refetch
  };
};

///////////
// helpers
///////////

function buildParseTx(lrtLookup: Record<Address, BaseAssetDetails>) {
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
      const isDeposit = type === TransactionType.Deposit;
      const _tx = tx as Deposit | WithdrawalRequest;
      return {
        type,
        date: dateFromTimestamp(+tx.timestamp),
        address: tx.sender,
        valueUSD: !isClaim ? Number(tx.valueUSD) : 0,
        amountChange: isClaim
          ? 0
          : Number(isDeposit ? _tx.amountIn : _tx.amountIn),
        restakingToken: lrtLookup[tx.restakingToken as Address],
        tx: tx.tx,
        ...(!isClaim && {
          userBalanceAfter: Number((tx as Deposit).userBalanceAfter)
        })
      } as RawTransactionEvent<R>;
    });
  };
}
