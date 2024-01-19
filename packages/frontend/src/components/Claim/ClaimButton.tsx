import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { Spinner } from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '@rio-monorepo/ui/components/Shared/Alert';
import { TX_BUTTON_VARIANTS } from '@rio-monorepo/ui/lib/constants';
import { useAccount, useWaitForTransaction } from 'wagmi';
import {
  ClaimWithdrawalParams,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { ContractError, LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { Hash } from 'viem';

type Props = {
  lrt: LRTDetails;
  claimWithdrawalParams: ClaimWithdrawalParams[];
  onSuccess?: (txHash?: Hash) => void;
};

const ClaimButton = ({ lrt, claimWithdrawalParams, onSuccess }: Props) => {
  const lrtClient = useLiquidRestakingToken(lrt?.address);
  const { address } = useAccount();

  const [claimTx, setClaimTx] = useState<Hash | undefined>(undefined);
  const [{ isClaiming, error, success }, setTxState] = useState<{
    isClaiming: boolean;
    error: ContractError | null;
    success: boolean;
  }>({
    isClaiming: false,
    error: null,
    success: false
  });

  const handleSuccess = useCallback(() => {
    onSuccess?.(claimTx);
  }, [claimTx]);

  const handleClaim = async () => {
    if (!lrtClient || !claimWithdrawalParams?.length) return;

    const claim = () => {
      return claimWithdrawalParams.length !== 1
        ? lrtClient.claimWithdrawalsForManyEpochs(claimWithdrawalParams)
        : lrtClient.claimWithdrawalsForEpoch(claimWithdrawalParams[0]);
    };

    await claim()
      .then(setClaimTx)
      .catch((error) => setTxState((prev) => ({ ...prev, error })));
  };

  const {
    data: txData,
    error: txError,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess
  } = useWaitForTransaction({ hash: claimTx });

  useEffect(() => {
    setTxState((prev) => ({
      ...prev,
      isClaiming: isTxLoading,
      error: txError,
      success: isTxSuccess
    }));
  }, [txData, txError, isTxLoading, isTxSuccess]);

  useEffect(() => {
    if (!success) return;
    handleSuccess();
  }, [success, handleSuccess]);

  const isValid = !!address && claimWithdrawalParams?.length > 0;

  return (
    <div className="mt-4">
      <AnimatePresence>
        {!claimTx && !error && (
          <motion.button
            className={cx(
              'rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
              !isValid && 'bg-opacity-20',
              isValid && !isClaiming && 'hover:bg-[var(--color-dark-gray)]'
            )}
            disabled={!isValid || isClaiming}
            onClick={() => void handleClaim()}
            variants={TX_BUTTON_VARIANTS}
            key={'claim'}
          >
            {!address && (
              <span className="opacity-20 text-black">
                Nothing available to claim
              </span>
            )}
            {address && isClaiming && (
              <div className="w-full text-center flex items-center justify-center gap-2">
                <Spinner width={16} />
                <span className="opacity-40">Claiming</span>
              </div>
            )}
            {address && !isClaiming && !error && (
              <span className={cx(!isValid && 'opacity-20 text-black')}>
                {isValid ? 'Claim' : 'Nothing available to claim'}
              </span>
            )}
          </motion.button>
        )}

        <Alert
          isSuccess={success}
          errorMessage={error?.shortMessage || error?.message}
          isError={!!error}
          setIsSuccess={() => {
            setClaimTx(undefined);
            setTxState({
              isClaiming: false,
              error: null,
              success: false
            });
          }}
          setIsError={(_e: boolean) =>
            setTxState((prev) => ({
              isClaiming: false,
              error: _e ? prev.error || new Error('An error occurred') : null,
              success: false
            }))
          }
        />
      </AnimatePresence>
    </div>
  );
};

export default ClaimButton;
