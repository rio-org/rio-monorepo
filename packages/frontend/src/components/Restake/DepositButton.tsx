import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '../Shared/Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { useAccount } from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { Hash } from 'viem';

type Props = {
  isValidAmount: boolean;
  isEmpty: boolean;
  isJoinLoading: boolean;
  isJoinSuccess: boolean;
  isJoinError: boolean;
  transactionHash: Hash | null;
  setIsJoinSuccess: (isSuccess: boolean) => void;
  setIsJoinError: (isError: boolean) => void;
  handleExecute: () => void;
};

const DepositButton = ({ isValidAmount, isEmpty, isJoinLoading, isJoinSuccess, isJoinError, transactionHash, setIsJoinSuccess, setIsJoinError, handleExecute }: Props) => {
  const [buttonText, setButtonText] = useState('Enter an amount');
  const { address } = useAccount();

  useEffect(() => {
    if (isValidAmount) {
      setButtonText('Restake');
    }
    if (isEmpty) {
      setButtonText('Enter an amount');
    }
    if (!isValidAmount && !isEmpty) {
      setButtonText('Invalid amount');
    }
    if (!address) {
      setButtonText('Connect to restake');
    }
  }, [isJoinSuccess, isJoinError, isValidAmount, isEmpty]);

  return (
    <AnimatePresence>
      {!isJoinSuccess && !isJoinError && (
        <motion.button
          className={cx(
            'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValidAmount && 'bg-opacity-20',
            isValidAmount && !isJoinLoading && 'hover:bg-[var(--color-dark-gray)]'
          )}
          disabled={!isValidAmount || isJoinLoading}
          onClick={() => {
            handleExecute();
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'restake'}
        >
          {isJoinLoading && (
            <span className="flex items-center justify-center">
              <span className="w-4 h-4 mb-2">
                <Spinner />
              </span>
            </span>
          )}
          {!isJoinLoading && !isJoinError && (
            <span
              className={cx(
                (!isValidAmount || !address) && 'opacity-20 text-black'
              )}
            >
              {buttonText}
            </span>
          )}
        </motion.button>
      )}
      <div className="mt-4">
        <Alert
          isSuccess={isJoinSuccess}
          isError={isJoinError}
          setIsSuccess={setIsJoinSuccess}
          setIsError={setIsJoinError}
        />
      </div>
    </AnimatePresence>
  );
};

export default DepositButton;
