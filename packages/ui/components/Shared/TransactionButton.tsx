import { useNetwork, useSwitchNetwork, useWaitForTransaction } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import { useCallback, useMemo } from 'react';
import { twJoin } from 'tailwind-merge';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { cn, getChainName } from '../../lib/utilities';
import { ViewTransactionLink } from './ViewTransactionLink';
import Alert from './Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { CHAIN_ID } from '../../config';
import type { ContractError } from '../../lib/typings';
import type { Hash } from '@wagmi/core';

export type TransactionButtonProps = {
  disabled?: boolean;
  isSigning?: boolean;
  hash?: Hash;
  error?: ContractError | null;
  reset?: () => void;
  clearErrors?: () => void;
  write?: () => void;
  children?: React.ReactNode | React.ReactNode[];
};

const TransactionButton = ({
  disabled,
  hash,
  error,
  reset,
  clearErrors,
  write,
  isSigning,
  children
}: TransactionButtonProps) => {
  const wrongNetwork = useNetwork().chain?.unsupported;
  const { openConnectModal } = useConnectModal();
  const { address } = useAccountIfMounted();
  const { isLoading: isSwitchNetworkLoading, switchNetwork } =
    useSwitchNetwork();

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    error: txError
  } = useWaitForTransaction({ hash });

  const [_error, _errorMessage] = useMemo(() => {
    const e = (txError ?? error) as ContractError | null;
    return [e, e?.shortMessage ?? e?.message];
  }, [txError, error]);

  const isDisabled = wrongNetwork
    ? isSwitchNetworkLoading
    : isTxLoading || isSigning || disabled || !write;

  const handleClick = useCallback((): void => {
    if (isDisabled) {
      return;
    }

    !address
      ? openConnectModal?.()
      : wrongNetwork
      ? switchNetwork?.(CHAIN_ID)
      : write?.();
  }, [isDisabled, address, wrongNetwork, switchNetwork, write]);

  return (
    <div className="flex flex-col gap-5 w-full max-w-full mt-4">
      <AnimatePresence>
        {isTxSuccess || _error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Alert
              errorMessage={_errorMessage}
              isSuccess={isTxSuccess}
              isError={!!_error}
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
              'disabled:!bg-opacity-20 disabled:!bg-black',
              'disabled:[&>span]:!opacity-20 disabled:[&>span]:!text-black'
            )}
          >
            {(() => {
              if (!address) {
                return <>Connect your wallet</>;
              }

              if (isTxLoading || isSwitchNetworkLoading || isSigning) {
                return <LoadingTransactionContent />;
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex justify-center items-center w-full"
          >
            <ViewTransactionLink hash={hash} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function LoadingTransactionContent() {
  return (
    <div className="w-full text-center flex items-center justify-center gap-2">
      <Spinner width={16} />
      <span className="text-black opacity-40">Awaiting confirmation</span>
    </div>
  );
}

export default TransactionButton;
