import { useNetwork, useSwitchNetwork, useWaitForTransaction } from 'wagmi';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from '@material-tailwind/react';
import { twJoin } from 'tailwind-merge';
import type { Hash } from '@wagmi/core';
import {
  useAddTransaction,
  usePendingTransactions
} from '../../contexts/RioTransactionStore';
import { useWalletAndTermsStore } from '../../contexts/WalletAndTermsStore';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { ContractError, RioTransactionType } from '../../lib/typings';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { cn, getChainName } from '../../lib/utilities';
import { ViewTransactionLink } from './ViewTransactionLink';
import Alert from './Alert';
import { CHAIN_ID } from '../../config';
import { IconWarning } from '../Icons/IconWarning';
import { IconX } from '../Icons/IconX';

export type TransactionButtonProps = {
  transactionType: RioTransactionType;
  disabled?: boolean;
  isSigning?: boolean;
  hash?: Hash;
  error?: ContractError | null;
  refetch?: () => void;
  reset?: () => void;
  clearErrors?: () => void;
  write?: () => void;
  children?: React.ReactNode | React.ReactNode[];
};

const TransactionButton = ({
  transactionType: type,
  disabled,
  hash,
  error,
  refetch,
  reset,
  clearErrors,
  write,
  isSigning,
  children
}: TransactionButtonProps) => {
  const wrongNetwork = useNetwork().chain?.unsupported;
  const { openWalletModal } = useWalletAndTermsStore();
  const { address } = useAccountIfMounted();
  const pendingTxs = usePendingTransactions();
  const addTransaction = useAddTransaction();
  const { isLoading: isSwitchNetworkLoading, switchNetwork } =
    useSwitchNetwork();
  const [internalError, setInternalError] = useState<ContractError | null>(
    error || null
  );

  const lastPendingTx = !pendingTxs.length
    ? null
    : pendingTxs[pendingTxs.length - 1];

  const prevTx = useMemo(() => {
    if (!lastPendingTx) return null;
    return {
      hash: lastPendingTx.hash,
      isSame: lastPendingTx.type === type
    };
  }, [lastPendingTx]);

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    error: txError
  } = useWaitForTransaction({
    hash: prevTx?.isSame ? prevTx.hash : hash
  });

  useEffect(() => {
    if (!error && !txError) return;
    setInternalError(error ?? txError);
  }, [error, txError]);

  const { isSuccess: isPrevTxSuccess } = useWaitForTransaction({
    hash: prevTx?.isSame ? undefined : prevTx?.hash
  });

  const shouldRefetchData = isTxSuccess || isPrevTxSuccess;
  useEffect(() => void (shouldRefetchData && refetch?.()), [shouldRefetchData]);

  useEffect(() => {
    if (!hash) return;
    addTransaction({ hash, type });
  }, [hash, type]);

  const [, _errorMessage] = useMemo(() => {
    const e = internalError;
    return [e, e?.shortMessage ?? e?.message];
  }, [internalError]);

  const isDisabled = wrongNetwork
    ? isSwitchNetworkLoading
    : isTxLoading || isSigning || disabled || !write || !!prevTx?.hash;

  const handleClick = useCallback((): void => {
    if (isDisabled) return;
    if (!address) return openWalletModal();
    setInternalError(null);
    clearErrors?.();
    wrongNetwork ? switchNetwork?.(CHAIN_ID) : write?.();
  }, [isDisabled, address, wrongNetwork, clearErrors, switchNetwork, write]);

  return (
    <div className="flex flex-col w-full max-w-full mt-4">
      <AnimatePresence>
        {_errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0, borderWidth: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              marginBottom: 16,
              borderWidth: 1
            }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, borderWidth: 0 }}
            className="w-full border rounded-lg border-[#EEBA00] px-3 py-3 space-y-2 text-[14px]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold">
                <IconWarning
                  height={14}
                  width={14}
                  className="[&>path]:stroke-[#EEBA00] [&>path]:stroke-[2]"
                />
                <span className="text-[#EEBA00] leading-none">
                  Transaction Error
                </span>
              </div>
              <button
                onClick={() => {
                  clearErrors?.();
                  setInternalError(null);
                }}
                className="opacity-30 hover:opacity-90 active:hover:opacity-100"
              >
                <IconX
                  height={16}
                  width={16}
                  className="[&>path]:stroke-[2.5]"
                />
              </button>
            </div>
            <p className="leading-snug">{_errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTxSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Alert
              isSuccess={isTxSuccess}
              isError={false}
              setIsSuccess={reset}
              setIsError={clearErrors || reset}
            />
          </motion.div>
        ) : (
          <motion.button
            variants={TX_BUTTON_VARIANTS}
            disabled={isDisabled}
            onClick={handleClick}
            className={twJoin(
              'w-full py-3 rounded-full',
              'text-white font-bold',
              'bg-black transition-colors duration-200',
              'hover:bg-[var(--color-dark-gray)]',
              'disabled:!bg-opacity-5 disabled:!bg-black',
              'disabled:[&>span]:!opacity-20 disabled:[&>span]:!text-black'
            )}
          >
            {(() => {
              if (!address) {
                <span className={cn(isDisabled && 'opacity-20 text-black')}>
                  Connect your wallet
                </span>;
              }

              if (
                isTxLoading ||
                isSwitchNetworkLoading ||
                isSigning ||
                prevTx?.hash
              ) {
                return (
                  <LoadingTransactionContent>
                    {prevTx &&
                      !prevTx?.isSame &&
                      'Awaiting previous transaction'}
                  </LoadingTransactionContent>
                );
              }

              return (
                <span className={cn(isDisabled && 'opacity-20 text-black')}>
                  {wrongNetwork
                    ? `Switch to ${getChainName(CHAIN_ID)}`
                    : children || 'Submit'}
                </span>
              );
            })()}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hash && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
            exit={{ height: 0, opacity: 0, margin: 0 }}
            className="flex justify-center items-center w-full"
          >
            <ViewTransactionLink hash={hash} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function LoadingTransactionContent({
  children
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full text-center flex items-center justify-center gap-2">
      <Spinner width={16} />
      <span className="text-black opacity-40">
        {children || 'Awaiting confirmation'}
      </span>
    </div>
  );
}

export default TransactionButton;
