import { AnimatePresence, motion } from 'framer-motion';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useTransactionButton } from '@rio-monorepo/ui/hooks/useTransactionButton';
import { type TransactionButtonProps } from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { cn, displayEthAmount } from '@rio-monorepo/ui/lib/utilities';

export type ClaimButtonProps = Pick<TransactionButtonProps, 'isSigning'> & {
  claimAmount?: string;
  claimAssetSymbol?: string;
  useTransactionButtonReturn: ReturnType<typeof useTransactionButton>;
  className?: string;
};

const ClaimButton = ({
  isSigning,
  claimAmount,
  claimAssetSymbol,
  useTransactionButtonReturn,
  className
}: ClaimButtonProps) => {
  const { chain } = useNetwork();
  const { address } = useAccountIfMounted();
  const { isLoading: isSwitchNetworkLoading } = useSwitchNetwork();
  const wrongNetwork = chain?.unsupported;
  const formattedAmount = displayEthAmount(claimAmount ?? '0');

  const { handleClick, isDisabled, isTxLoading, prevTx } =
    useTransactionButtonReturn;

  return (
    <motion.button
      disabled={isDisabled || !address}
      onClick={handleClick}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center px-3 h-9 text-[14px] font-bold rounded-lg',
        'bg-white text-[#301FC4] disabled:text-white',
        claimAmount &&
          claimAmount !== '0' &&
          (isSigning || isSwitchNetworkLoading || isTxLoading || prevTx?.hash)
          ? 'disabled:opacity-70 disabled:bg-transparent '
          : 'disabled:opacity-10 disabled:bg-black',
        className
      )}
    >
      <AnimatePresence>
        {(isSigning ||
          isSwitchNetworkLoading ||
          isTxLoading ||
          (claimAmount && prevTx?.hash)) && (
          <motion.span
            key="loading"
            className="inline-block overflow-hidden"
            initial={{ opacity: 0, width: 0, marginRight: 0 }}
            animate={{ opacity: 1, width: 'auto', marginRight: 8 }}
            exit={{ opacity: 0, width: 0, marginRight: 0 }}
          >
            <Spinner width={16} />
          </motion.span>
        )}
      </AnimatePresence>
      <span>
        {(() => {
          if (!address) return 'Claim';
          if (wrongNetwork) return 'Switch network';
          if (isTxLoading || isSigning) return 'Claiming';
          if (isSwitchNetworkLoading) return 'Switching';
          if (claimAmount && prevTx?.hash) return 'Waiting';
          if (formattedAmount === '0' || !claimAssetSymbol) return 'Claim';

          return `Claim ${formattedAmount} ${claimAssetSymbol}`;
        })()}
      </span>
    </motion.button>
  );
};

export default ClaimButton;
