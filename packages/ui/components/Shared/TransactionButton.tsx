import { AnimatePresence, motion } from 'framer-motion';
import { useSwitchChain } from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import {
  useTransactionButton,
  type UseTransactionButtonConfig
} from '../../hooks/useTransactionButton';
import { cn, getChainName } from '../../lib/utilities';
import { ViewTransactionLink } from './ViewTransactionLink';
import { IconWarning } from '../Icons/IconWarning';
import { IconX } from '../Icons/IconX';
import { CHAIN_ID } from '../../config';
import { useEffect } from 'react';
import { Button } from '../shadcn/button';
import { useRegionChecked } from '../../hooks/useRegionChecked';
import { mainnet } from 'viem/chains';

export type TransactionButtonProps = UseTransactionButtonConfig & {
  reset?: () => void;
  clearErrors?: () => void;
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const TransactionButton = ({
  transactionType: type,
  toasts,
  disabled,
  hash,
  error,
  refetch,
  reset,
  clearErrors,
  write,
  isSigning,
  className,
  children
}: TransactionButtonProps) => {
  const { address, chain } = useAccountIfMounted();
  const { chains, isPending: isSwitchNetworkLoading } = useSwitchChain();
  const wrongNetwork = !!address && !chains.find((c) => c.id === chain?.id);
  const [{ data: isInAllowedRegion }] = useRegionChecked();

  const {
    errorMessage,
    handleClick,
    handleClearErrors,
    isDisabled,
    isTxSuccess,
    isTxLoading,
    switchNetworkChainId,
    prevTx
  } = useTransactionButton({
    transactionType: type,
    toasts,
    disabled,
    hash,
    error,
    refetch,
    clearErrors,
    write,
    isSigning
  });

  useEffect(() => void isTxSuccess && reset?.(), [isTxSuccess, reset]);

  return (
    <div className={cn('flex flex-col w-full max-w-full mt-4', className)}>
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0, borderWidth: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              marginBottom: 16,
              borderWidth: 1
            }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, borderWidth: 0 }}
            className="w-full border rounded-[4px] border-warning-foreground bg-warning px-3 py-3 space-y-2 text-[14px]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold">
                <IconWarning
                  height={14}
                  width={14}
                  className="[&>path]:stroke-warning-foreground [&>path]:stroke-[2]"
                />
                <span className="text-warning-foreground leading-none">
                  Transaction Error
                </span>
              </div>
              <button
                onClick={handleClearErrors}
                className="opacity-30 hover:opacity-90 active:hover:opacity-100"
              >
                <IconX
                  height={16}
                  width={16}
                  className="[&>path]:stroke-[2.5]"
                />
              </button>
            </div>
            <p className="leading-snug">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        <Button
          disabled={
            isDisabled ||
            (chain?.id === mainnet.id && isInAllowedRegion === false)
          }
          onClick={handleClick}
          className="w-full font-bold text-base py-3 leading-6 h-12"
        >
          {(() => {
            if (!address) {
              <span>Connect your wallet</span>;
            }

            if (chain?.id === mainnet.id && isInAllowedRegion === false) {
              return <span>Unsupported region</span>;
            }

            if (
              isTxLoading ||
              isSwitchNetworkLoading ||
              isSigning ||
              prevTx?.hash
            ) {
              return (
                <LoadingTransactionContent>
                  {prevTx && !prevTx?.isSame && 'Awaiting previous transaction'}
                </LoadingTransactionContent>
              );
            }

            return (
              <span>
                {wrongNetwork
                  ? `Switch to ${getChainName(switchNetworkChainId)}`
                  : children || 'Submit'}
              </span>
            );
          })()}
        </Button>
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
      <span>{children || 'Awaiting confirmation'}</span>
    </div>
  );
}

export default TransactionButton;
