import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '../Shared/Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { Spinner } from '@material-tailwind/react';
import { EthereumAddress } from '../../lib/typings';
import { CHAIN_ID } from '../../../config';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { getChainName } from '../../lib/utilities';

type Props = {
  isValidAmount: boolean;
  isEmpty: boolean;
  isDepositLoading: boolean;
  isDepositSuccess: boolean;
  isDepositError: boolean;
  depositTxHash?: `0x${string}`;
  accountAddress?: EthereumAddress;
  setIsDepositSuccess: (isSuccess: boolean) => void;
  setIsDepositError: (isError: boolean) => void;
  handleExecute: () => void;
};

const DepositButton = ({
  isValidAmount,
  isEmpty,
  isDepositLoading,
  isDepositSuccess,
  isDepositError,
  accountAddress,
  depositTxHash,
  setIsDepositSuccess,
  setIsDepositError,
  handleExecute
}: Props) => {
  const [buttonText, setButtonText] = useState('Enter an amount');
  const { chain } = useNetwork();
  const { error, isLoading, switchNetwork } = useSwitchNetwork();
  const wrongNetwork = chain?.id !== CHAIN_ID;

  useEffect(() => {
    if (!error) return;
    console.error('error switching networks');
  }, [error]);

  useEffect(() => {
    if (isValidAmount) {
      setButtonText('Restake');
    }
    if (isEmpty) {
      setButtonText('Enter an amount');
    }
    if (!isValidAmount && !isEmpty) {
      setButtonText('Insufficient balance');
    }
    if (!accountAddress) {
      setButtonText('Connect to restake');
    }
  }, [
    isDepositSuccess,
    isDepositError,
    isValidAmount,
    isEmpty,
    accountAddress
  ]);

  return (
    <AnimatePresence>
      {(isDepositError || isDepositSuccess) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="mt-4">
            <Alert
              isSuccess={isDepositSuccess}
              isError={isDepositError}
              depositTxHash={depositTxHash}
              setIsSuccess={setIsDepositSuccess}
              setIsError={setIsDepositError}
            />
          </div>
        </motion.div>
      )}

      {wrongNetwork && (
        <motion.button
          className={cx(
            'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValidAmount && 'bg-opacity-20',
            isValidAmount && 'hover:bg-[var(--color-dark-gray)]'
          )}
          onClick={() => {
            switchNetwork?.(CHAIN_ID);
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'switchNetwork'}
        >
          {!isLoading && `Switch to ${getChainName(CHAIN_ID)}`}
          {isLoading && (
            <div className="w-full text-center flex items-center justify-center gap-2">
              <Spinner width={16} />
              <span className="opacity-40">Awaiting confirmation</span>
            </div>
          )}
        </motion.button>
      )}
      {!wrongNetwork && (!isDepositError || !isDepositSuccess) && (
        <motion.button
          className={cx(
            'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValidAmount && 'bg-opacity-20',
            isValidAmount &&
              !isDepositLoading &&
              'hover:bg-[var(--color-dark-gray)]'
          )}
          disabled={!isValidAmount || isDepositLoading}
          onClick={() => {
            handleExecute();
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'restakeContent'}
        >
          {isDepositLoading && (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 mb-2">
                <Spinner width={16} />
              </span>
              <span className="opacity-40">Awaiting confirmation</span>
            </span>
          )}
          {!isDepositLoading && (
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
