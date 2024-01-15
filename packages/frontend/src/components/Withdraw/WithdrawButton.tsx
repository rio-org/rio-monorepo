import React from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Alert from '../Shared/Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { EthereumAddress } from '../../lib/typings';
import { Hash } from 'viem';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { CHAIN_ID } from '../../../config';
import { getChainName } from '../../lib/utilities';

type Props = {
  isValid: boolean;
  isWithdrawalLoading: boolean;
  isWithdrawalSuccess: boolean;
  isWithdrawalError: boolean;
  accountAddress: EthereumAddress;
  exitTxHash?: Hash;
  setIsWithdrawalSuccess: (isSuccess: boolean) => void;
  setIsWithdrawalError: (isError: boolean) => void;
  handleExecute: () => void;
  clearForm: () => void;
};

const WithdrawButton = ({
  isValid,
  isWithdrawalLoading,
  isWithdrawalSuccess,
  isWithdrawalError,
  exitTxHash,
  handleExecute,
  setIsWithdrawalSuccess,
  setIsWithdrawalError
}: Props) => {
  const { chain } = useNetwork();
  const { isLoading: isSwitchNetworkLoading, switchNetwork } =
    useSwitchNetwork();
  const wrongNetwork = chain?.id !== CHAIN_ID;
  return (
    <AnimatePresence>
      {(isWithdrawalError || isWithdrawalSuccess) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="mt-4">
            <Alert
              isSuccess={isWithdrawalSuccess}
              isError={isWithdrawalError}
              txHash={exitTxHash}
              setIsSuccess={setIsWithdrawalSuccess}
              setIsError={setIsWithdrawalError}
            />
          </div>
        </motion.div>
      )}

      {wrongNetwork && (
        <motion.button
          className={cx(
            'rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValid && 'bg-opacity-20',
            isValid && 'hover:bg-[var(--color-dark-gray)]'
          )}
          onClick={() => {
            switchNetwork?.(CHAIN_ID);
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'switchNetwork'}
        >
          {!isSwitchNetworkLoading && `Switch to ${getChainName(CHAIN_ID)}`}
          {isSwitchNetworkLoading && (
            <div className="w-full text-center flex items-center justify-center gap-2">
              <Spinner width={16} />
              <span className="opacity-40">Awaiting confirmation</span>
            </div>
          )}
        </motion.button>
      )}

      {!wrongNetwork && (
        <motion.button
          className={cx(
            'rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValid && 'bg-opacity-20',
            isValid && 'hover:bg-[var(--color-dark-gray)]'
          )}
          disabled={!isValid || isWithdrawalLoading}
          onClick={() => {
            handleExecute();
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'withdraw'}
        >
          {isWithdrawalLoading && (
            <div className="w-full text-center flex items-center justify-center gap-2">
              <Spinner width={16} />
              <span className="opacity-40">Submitting request</span>
            </div>
          )}
          {!isWithdrawalLoading && (
            <span className={cx(!isValid && 'opacity-20 text-black')}>
              {isValid ? 'Request withdraw' : 'Enter an amount'}
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default WithdrawButton;
