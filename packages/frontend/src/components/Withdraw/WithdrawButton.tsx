import React, { useMemo } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Alert from '@rio-monorepo/ui/components/Shared/Alert';
import { TX_BUTTON_VARIANTS } from '@rio-monorepo/ui/lib/constants';
import { Hash } from 'viem';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import {
  getChainName,
  linkToTxOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { twJoin } from 'tailwind-merge';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';

type Props = {
  isValidAmount: boolean;
  isEmpty: boolean;
  isWithdrawalLoading: boolean;
  isWithdrawalSuccess: boolean;
  isWithdrawalError: boolean;
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
  const { address } = useAccountIfMounted();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const { isLoading: isSwitchNetworkLoading, switchNetwork } =
    useSwitchNetwork();
  const wrongNetwork = !!address && chain?.id !== CHAIN_ID;

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

  const handleClick = () => {
    !address
      ? openConnectModal?.()
      : wrongNetwork
      ? switchNetwork?.(CHAIN_ID)
      : handleExecute();
  };

  return (
    <>
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

      <AnimatePresence>
        {exitTxHash && (
          <motion.div
            className="mt-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div>
              <a
                href={
                  exitTxHash
                    ? linkToTxOnBlockExplorer(exitTxHash, CHAIN_ID)
                    : ''
                }
                target="_blank"
                rel="noreferrer"
                className={twJoin(
                  'flex flex-row justify-center items-center gap-2',
                  'w-full h-fit',
                  'px-[8px] py-[2px] rounded-full',
                  'text-center text-gray-500 text-sm font-normal leading-none whitespace-nowrap',
                  'transition-colors duration-200 '
                )}
              >
                View transaction
                <div className="opacity-50">
                  <IconExternal transactionStatus="None" />
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WithdrawButton;
