import React, { useMemo } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Alert from '@rio-monorepo/ui/components/Shared/Alert';
import { TX_BUTTON_VARIANTS } from '@rio-monorepo/ui/lib/constants';
import { Hash, Address } from 'viem';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import { getChainName } from '@rio-monorepo/ui/lib/utilities';

type Props = {
  isValidAmount: boolean;
  isEmpty: boolean;
  isWithdrawalLoading: boolean;
  isWithdrawalSuccess: boolean;
  isWithdrawalError: boolean;
  accountAddress: Address;
  exitTxHash?: Hash;
  setIsWithdrawalSuccess: (isSuccess: boolean) => void;
  setIsWithdrawalError: (isError: boolean) => void;
  handleExecute: () => void;
  clearForm: () => void;
};

const WithdrawButton = ({
  isValidAmount,
  isEmpty,
  isWithdrawalLoading,
  isWithdrawalSuccess,
  isWithdrawalError,
  exitTxHash,
  handleExecute,
  setIsWithdrawalSuccess,
  setIsWithdrawalError
}: Props) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { isLoading: isSwitchNetworkLoading, switchNetwork } =
    useSwitchNetwork();
  const wrongNetwork = chain?.id !== CHAIN_ID;

  const buttonText = useMemo(() => {
    if (!address) return 'Connect to withdraw';
    if (wrongNetwork) return `Switch to ${getChainName(CHAIN_ID)}`;
    if (isEmpty) return 'Enter an amount';
    if (!isValidAmount && !isEmpty) return 'Insufficient balance';
    return 'Request withdraw';
  }, [isValidAmount, isEmpty, address, wrongNetwork]);

  const isDisabled = wrongNetwork
    ? isSwitchNetworkLoading
    : !isValidAmount || isEmpty || isWithdrawalLoading;

  const handleClick = () =>
    wrongNetwork ? switchNetwork?.(CHAIN_ID) : handleExecute();

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
      <motion.button
        className={cx(
          'rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
          isDisabled ? 'bg-opacity-20' : 'hover:bg-[var(--color-dark-gray)]'
        )}
        disabled={isDisabled}
        onClick={handleClick}
        variants={TX_BUTTON_VARIANTS}
      >
        {isWithdrawalLoading || isSwitchNetworkLoading ? (
          <div className="w-full text-center flex items-center justify-center gap-2">
            <Spinner width={16} />
            <span className="text-black opacity-20">
              {isWithdrawalLoading
                ? 'Submitting request'
                : 'Awaiting confirmation'}
            </span>
          </div>
        ) : (
          <span className={cx(isDisabled && 'opacity-20 text-black')}>
            {buttonText}
          </span>
        )}
      </motion.button>
    </AnimatePresence>
  );
};

export default WithdrawButton;
