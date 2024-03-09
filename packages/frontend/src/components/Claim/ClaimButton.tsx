import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import { useSwitchChain } from 'wagmi';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useTransactionButton } from '@rio-monorepo/ui/hooks/useTransactionButton';
import { type TransactionButtonProps } from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { cn, displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
import { Button } from '@rio-monorepo/ui/components/shadcn/button';

export type ClaimButtonProps = Pick<TransactionButtonProps, 'isSigning'> & {
  claimAmount?: string;
  claimAssetSymbol?: string;
  useTransactionButtonReturn: ReturnType<typeof useTransactionButton>;
  className?: string;
};

const MotionBtn = motion(Button);

const ClaimButton = ({
  isSigning,
  claimAmount,
  claimAssetSymbol,
  useTransactionButtonReturn,
  className
}: ClaimButtonProps) => {
  const { address, chain } = useAccountIfMounted();
  const { chains, isPending: isSwitchNetworkLoading } = useSwitchChain();
  const wrongNetwork = !!address && !chains.find((c) => c.id === chain?.id);
  const formattedAmount = displayEthAmount(claimAmount ?? '0');

  const { handleClick, isDisabled, isTxLoading, prevTx } =
    useTransactionButtonReturn;

  return (
    <MotionBtn
      disabled={isDisabled || !address}
      // disabled={true}
      onClick={handleClick}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center px-3 h-9 text-[14px] font-bold rounded-[2px]',
        'bg-background dark:bg-backgroundA7 text-rio-blue disabled:text-background',
        'hover:bg-background/80',
        claimAmount &&
          claimAmount !== '0' &&
          (isSigning || isSwitchNetworkLoading || isTxLoading || prevTx?.hash)
          ? 'disabled:opacity-70 disabled:bg-transparent '
          : 'disabled:bg-opacity-10 disabled:bg-primary',
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
    </MotionBtn>
  );
};

export default ClaimButton;
