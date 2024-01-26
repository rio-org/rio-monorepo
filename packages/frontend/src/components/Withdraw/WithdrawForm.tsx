import { Alert, Spinner } from '@material-tailwind/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type AssetDetails,
  type LRTDetails,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';
import WithdrawAssetSelector from './WithdrawAssetSelector';
import WithdrawField from './WithdrawField';
import WithdrawItemized from './WithdrawItemized';
import {
  useLiquidRestakingToken,
  LiquidRestakingTokenClient
} from '@rionetwork/sdk-react';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { useSubgraphConstractWrite } from '@rio-monorepo/ui/hooks/useSubgraphContractWrite';

const WithdrawForm = ({ lrt }: { lrt?: LRTDetails }) => {
  const assets = useMemo(() => {
    return lrt?.underlyingAssets.map((t) => t.asset) || [];
  }, [lrt]);

  const isMounted = useIsMounted();
  const [amount, setAmount] = useState<bigint | null>(null);
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);
  const [amountOut, setAmountOut] = useState<bigint>(BigInt(0));

  const restakingToken = useLiquidRestakingToken(lrt?.address as string);
  const { address } = useAccountIfMounted();

  const { refetch: refetchAssetBalance } = useAssetBalance(activeToken);
  const {
    data: balance,
    isError: balanceError,
    isLoading: isBalanceLoading,
    refetch: refetchLrtBalance
  } = useAssetBalance(lrt);

  const restakingTokenBalance = balance?.value || BigInt(0);
  const isValidAmount =
    amount !== null && amount > BigInt(0) && amount <= restakingTokenBalance;

  useEffect(() => {
    if (!restakingToken) return;
    queryAmountOut(restakingToken, activeToken, amount)
      .then((amount) => typeof amount !== 'undefined' && setAmountOut(amount))
      .catch(console.error);
  }, [amount, restakingToken, activeToken]);

  const execute = useCallback(async () => {
    if (
      !restakingToken ||
      !amount ||
      !address ||
      !activeToken?.address ||
      !isValidAmount
    ) {
      return;
    }

    return await restakingToken?.requestWithdrawal({
      amountIn: amount,
      assetOut: activeToken.address
    });
  }, [restakingToken, amount, activeToken?.address, address, isValidAmount]);

  const refetch = useCallback(async () => {
    await refetchLrtBalance();
    await refetchAssetBalance();
  }, [refetchLrtBalance, refetchAssetBalance]);

  const { txHash, isLoading, error, success, write, reset } =
    useSubgraphConstractWrite({
      execute,
      onReset: refetch,
      enabled:
        !!amount &&
        !!restakingToken &&
        !!address &&
        !!activeToken?.address &&
        isValidAmount
    });

  const resetAmount = useCallback(() => {
    setAmount(null);
  }, [assets]);

  const resetForm = useCallback(() => {
    reset();
    resetAmount();
  }, [reset, resetAmount]);

  const handleChangeAmount = useCallback(
    (amount: bigint | null) => {
      if (txHash || error) reset();
      setAmount(amount);
    },
    [error, reset, txHash]
  );

  useEffect(() => void (success && resetAmount()), [success, resetAmount]);

  return (
    <>
      {isBalanceLoading && (
        <div className="w-full text-center min-h-[100px] flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {!!address && balanceError && (
        <Alert color="red">Error loading account balance.</Alert>
      )}
      {isMounted && !isBalanceLoading && (
        <>
          {!!lrt && (
            <WithdrawField
              disabled={isLoading || !address}
              amount={amount}
              restakingTokenBalance={restakingTokenBalance}
              restakingToken={lrt}
              setAmount={handleChangeAmount}
            />
          )}
          {assets.length > 1 && (
            <WithdrawAssetSelector
              assetsList={assets}
              activeToken={activeToken}
              setActiveToken={setActiveToken}
            />
          )}
          <WithdrawItemized
            assets={assets}
            restakingToken={lrt}
            amount={amountOut}
            activeToken={activeToken}
          />

          <TransactionButton
            transactionType={RioTransactionType.WITHDRAW_REQUEST}
            hash={txHash}
            refetch={refetch}
            disabled={!address || !amount || !isValidAmount || isLoading}
            isSigning={isLoading}
            error={error}
            reset={resetForm}
            clearErrors={reset}
            write={write}
          >
            {!amount
              ? 'Enter an amount'
              : amount && !isValidAmount
              ? 'Insufficient balance'
              : 'Request withdrawal'}
          </TransactionButton>
        </>
      )}
    </>
  );
};

export default WithdrawForm;

/////////////
// helpers
/////////////

async function queryAmountOut(
  restakingToken: LiquidRestakingTokenClient | null,
  activeToken: AssetDetails,
  amount: bigint | null
): Promise<bigint | undefined> {
  if (amount === BigInt(0)) {
    return BigInt(0);
  }

  const query = await restakingToken?.getEstimatedOutForWithdrawalRequest({
    amountIn: amount || BigInt(0),
    assetOut: activeToken.address
  });

  return query as bigint;
}
