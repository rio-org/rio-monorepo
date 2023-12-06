import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '../Shared/Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { Spinner } from '@material-tailwind/react';
import { EthereumAddress } from '../../lib/typings';

type Props = {
  isValidAmount: boolean;
  isEmpty: boolean;
  isJoinLoading: boolean;
  isJoinSuccess: boolean;
  isJoinError: boolean;
  joinTxHash?: `0x${string}`;
  accountAddress?: EthereumAddress;
  setIsJoinSuccess: (isSuccess: boolean) => void;
  setIsJoinError: (isError: boolean) => void;
  handleExecute: () => void;
};

const DepositButton = ({
  isValidAmount,
  isEmpty,
  isJoinLoading,
  isJoinSuccess,
  isJoinError,
  accountAddress,
  joinTxHash,
  setIsJoinSuccess,
  setIsJoinError,
  handleExecute
}: Props) => {
  const [buttonText, setButtonText] = useState('Enter an amount');
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
    if (!accountAddress) {
      setButtonText('Connect to restake');
    }
  }, [isJoinSuccess, isJoinError, isValidAmount, isEmpty, accountAddress]);

  return (
    <AnimatePresence>
      {(isJoinError || isJoinSuccess) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="mt-4">
            <Alert
              isSuccess={isJoinSuccess}
              isError={isJoinError}
              joinTxHash={joinTxHash}
              setIsSuccess={setIsJoinSuccess}
              setIsError={setIsJoinError}
            />
          </div>
        </motion.div>
      )}

      {(!isJoinError || !isJoinSuccess) && (
        <motion.button
          className={cx(
            'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValidAmount && 'bg-opacity-20',
            isValidAmount &&
              !isJoinLoading &&
              'hover:bg-[var(--color-dark-gray)]'
          )}
          disabled={!isValidAmount || isJoinLoading}
          onClick={() => {
            handleExecute();
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'restakeContent'}
        >
          {isJoinLoading && (
            <span className="flex items-center justify-center">
              <span className="w-4 h-4 mb-2">
                <Spinner />
              </span>
            </span>
          )}
          {!isJoinLoading && (
            <span
              className={cx(
                (!isValidAmount || !accountAddress) && 'opacity-20 text-black'
              )}
            >
              {buttonText}
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default DepositButton;
