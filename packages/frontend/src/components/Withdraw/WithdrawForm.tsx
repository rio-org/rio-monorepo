import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from '@material-tailwind/react';
import { parseUnits } from 'viem';
import {
  useLiquidRestakingToken,
  type LiquidRestakingTokenClient
} from '@rionetwork/sdk-react';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import WithdrawAssetSelector from './WithdrawAssetSelector';
import WithdrawItemized from './WithdrawItemized';
import WithdrawField from './WithdrawField';
import { useSubgraphConstractWrite } from '@rio-monorepo/ui/hooks/useSubgraphContractWrite';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';
import {
  type AssetDetails,
  type LRTDetails,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';

export function WithdrawForm({
  lrtDetails,
  onSuccess
}: {
  lrtDetails?: LRTDetails;
  onSuccess?: () => void;
}) {
  if (lrtDetails) {
    return (
      <WithdrawFormWithLRTWrapper
        lrtDetails={lrtDetails}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <WithdrawFormBase
      lrtDetails={lrtDetails}
      restakingTokenClient={null}
      onSuccess={onSuccess}
    />
  );
}

function WithdrawFormWithLRTWrapper({
  lrtDetails,
  onSuccess
}: {
  lrtDetails: LRTDetails;
  onSuccess?: () => void;
}) {
  const restakingTokenClient = useLiquidRestakingToken(lrtDetails.address);
  return (
    <WithdrawFormBase
      restakingTokenClient={restakingTokenClient}
      lrtDetails={lrtDetails}
      onSuccess={onSuccess}
    />
  );
}

function WithdrawFormBase({
  restakingTokenClient,
  lrtDetails,
  onSuccess
}: {
  restakingTokenClient: LiquidRestakingTokenClient | null;
  lrtDetails?: LRTDetails;
  onSuccess?: () => void;
}) {
  const assets = useMemo(() => {
    return lrtDetails?.underlyingAssets.map((t) => t.asset) || [];
  }, [lrtDetails]);

  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);
  const [amountOut, setAmountOut] = useState<bigint>(BigInt(0));
  const [inputAmount, setInputAmount] = useState<string>('');

  const amount = inputAmount
    ? parseUnits(inputAmount, activeToken?.decimals || 18)
    : null;

  const { refetch: refetchAssetBalance } = useAssetBalance(activeToken);
  const { address } = useAccountIfMounted();
  const {
    data: balance,
    isError: balanceError,
    refetch: refetchLrtBalance
  } = useAssetBalance(lrtDetails);

  const restakingTokenBalance = balance?.value || BigInt(0);
  const isValidAmount =
    amount !== null && amount > BigInt(0) && amount <= restakingTokenBalance;

  useEffect(() => {
    if (!restakingTokenClient) return;
    queryAmountOut(restakingTokenClient, activeToken, amount)
      .then((amount) => typeof amount !== 'undefined' && setAmountOut(amount))
      .catch(console.error);
  }, [amount, restakingTokenClient, activeToken]);

  const execute = useCallback(async () => {
    if (
      !restakingTokenClient ||
      !amount ||
      !address ||
      !activeToken?.address ||
      !isValidAmount
    ) {
      return;
    }

    return await restakingTokenClient?.requestWithdrawal({
      amountIn: amount,
      assetOut: activeToken.address
    });
  }, [
    restakingTokenClient,
    amount,
    activeToken?.address,
    address,
    isValidAmount
  ]);

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
        !!restakingTokenClient &&
        !!address &&
        !!activeToken?.address &&
        isValidAmount
    });

  const resetAmount = useCallback(() => {
    setInputAmount('');
    onSuccess?.();
  }, [assets, onSuccess]);

  const resetForm = useCallback(() => {
    reset();
    resetAmount();
  }, [reset, resetAmount]);

  const handleChangeAmount = useCallback(
    (amount: string) => {
      if (txHash || error) reset();
      setInputAmount(amount);
    },
    [error, reset, txHash]
  );

  useEffect(() => void (success && resetAmount()), [success, resetAmount]);

  return (
    <>
      {!!address && balanceError && (
        <Alert color="red">Error loading account balance.</Alert>
      )}
      <WithdrawField
        activeToken={activeToken}
        disabled={isLoading || !address}
        amount={inputAmount}
        restakingTokenBalance={restakingTokenBalance}
        lrtDetails={lrtDetails}
        setAmount={handleChangeAmount}
      />
      {assets.length > 1 && (
        <WithdrawAssetSelector
          assetsList={assets}
          activeToken={activeToken}
          setActiveToken={setActiveToken}
        />
      )}
      <WithdrawItemized
        assets={assets}
        lrtDetails={lrtDetails}
        amount={amountOut}
        activeToken={activeToken}
      />

      <TransactionButton
        transactionType={RioTransactionType.WITHDRAW_REQUEST}
        toasts={{
          sent: `Withdrawal request sent`,
          success: `Sucessfully requested to unstake ${inputAmount} ${lrtDetails?.symbol}`,
          error: `An error occurred  requesting withdrawal`
        }}
        hash={txHash}
        refetch={refetch}
        disabled={!address || !amount || !isValidAmount || isLoading}
        isSigning={isLoading}
        error={error}
        reset={resetForm}
        clearErrors={reset}
        write={write}
      >
        Request withdrawal
      </TransactionButton>
    </>
  );
}

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
