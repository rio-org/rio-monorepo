import { LiquidRestakingTokenClient } from '@rionetwork/sdk-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';
import { useSubgraphConstractWrite } from '@rio-monorepo/ui/hooks/useSubgraphContractWrite';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';
import { AssetDetails, LRTDetails } from '@rio-monorepo/ui/lib/typings';

export const useWithdrawForm = ({
  inputAmount,
  activeToken,
  assets,
  restakingTokenClient,
  lrtDetails,
  setInputAmount,
  onSuccess
}: {
  inputAmount: string;
  assets: AssetDetails[];
  activeToken: AssetDetails;
  restakingTokenClient: LiquidRestakingTokenClient | null;
  lrtDetails: LRTDetails | undefined;
  setInputAmount: (amount: string) => void;
  onSuccess?: () => void;
}) => {
  const [amountOut, setAmountOut] = useState<bigint>(BigInt(0));

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

  const contractWrite = useMemo(
    () => ({
      txHash,
      isLoading,
      error,
      success,
      write,
      reset
    }),
    [txHash, isLoading, error, success, write, reset]
  );

  return {
    contractWrite,
    restakingTokenBalance,
    balanceError,
    handleChangeAmount,
    resetForm,
    isValidAmount,
    amount,
    amountOut,
    refetch
  };
};

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
