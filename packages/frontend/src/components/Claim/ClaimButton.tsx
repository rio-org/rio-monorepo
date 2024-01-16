import React, { useState } from 'react';
import cx from 'classnames';
import { Spinner } from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '../Shared/Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { useAccount } from 'wagmi';
import {
  ClaimWithdrawalParams,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { ContractError, LRTDetails } from '../../lib/typings';
import { Hash } from 'viem';

type Props = {
  lrt: LRTDetails;
  claimWithdrawalParams: ClaimWithdrawalParams[];
  onSuccess?: (txHash?: Hash) => void;
};

const ClaimButton = ({ lrt, claimWithdrawalParams, onSuccess }: Props) => {
  const { address } = useAccount();
  const isValid = !!address && claimWithdrawalParams?.length > 0;
  const lrtClient = useLiquidRestakingToken(lrt?.address);

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimTx, setClaimTx] = useState<Hash | undefined>(undefined);
  const [error, setError] = useState<ContractError | undefined>(undefined);

  const handleSuccess = (txHash: Hash) => {
    setClaimTx(txHash);
    onSuccess?.(txHash);
  };

  const handleClaim = async () => {
    if (!lrtClient || !claimWithdrawalParams?.length) return;

    const claim = () => {
      setIsClaiming(true);
      setClaimTx(undefined);
      return claimWithdrawalParams.length !== 1
        ? lrtClient.claimWithdrawalsForManyEpochs(claimWithdrawalParams)
        : lrtClient.claimWithdrawalsForEpoch(claimWithdrawalParams[0]);
    };

    await claim()
      .then(handleSuccess)
      .catch(setError)
      .finally(() => setIsClaiming(false));
  };

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
          isSuccess={!!claimTx}
          errorMessage={error?.shortMessage || error?.message}
          isError={!!error}
          setIsSuccess={() => setClaimTx(undefined)}
          setIsError={(_e: boolean) =>
            setError((prev) =>
              _e ? prev || new Error('An error occurred') : undefined
            )
          }
        />
      </AnimatePresence>
    </div>
  );
};

export default ClaimButton;
