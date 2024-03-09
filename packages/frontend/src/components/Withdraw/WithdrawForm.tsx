import { Alert } from '@material-tailwind/react';
import { useMemo, useState } from 'react';
import {
  useLiquidRestakingToken,
  type LiquidRestakingTokenClient
} from '@rionetwork/sdk-react';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import {
  type AssetDetails,
  type LRTDetails,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';
import WithdrawAssetSelector from './WithdrawAssetSelector';
import WithdrawItemized from './WithdrawItemized';
import WithdrawField from './WithdrawField';
import { useWithdrawForm } from '../../hooks/useWithdrawForm';

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
  const [inputAmount, setInputAmount] = useState<string>('');
  const { address } = useAccountIfMounted();

  const {
    contractWrite,
    restakingTokenBalance,
    balanceError,
    handleChangeAmount,
    resetForm,
    isValidAmount,
    amount,
    amountOut,
    refetch
  } = useWithdrawForm({
    inputAmount,
    activeToken,
    assets,
    restakingTokenClient,
    lrtDetails,
    setInputAmount,
    onSuccess
  });

  return (
    <>
      {!!address && balanceError && (
        <Alert color="red">Error loading account balance.</Alert>
      )}
      <WithdrawField
        activeToken={activeToken}
        disabled={contractWrite.isLoading || !address}
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
        hash={contractWrite.txHash}
        refetch={refetch}
        disabled={
          !address || !amount || !isValidAmount || contractWrite.isLoading
        }
        isSigning={contractWrite.isLoading}
        error={contractWrite.error}
        reset={resetForm}
        clearErrors={contractWrite.reset}
        write={contractWrite.write}
      >
        Request withdrawal
      </TransactionButton>
    </>
  );
}
