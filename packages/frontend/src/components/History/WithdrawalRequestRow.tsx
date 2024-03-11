import { type WithdrawalRequest } from '@rionetwork/sdk-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { type Hash } from 'viem';
import { useMemo } from 'react';
import TransactionStatusLabel from '@rio-monorepo/ui/components/Shared/TransactionStatusLabel';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';
import { Button } from '@rio-monorepo/ui/components/shadcn/button';
import { useGetAssetsList } from '@rio-monorepo/ui/hooks/useGetAssetsList';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import {
  dateFromTimestamp,
  displayEthAmount,
  isEqualAddress,
  linkToTxOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';

type Props = {
  transaction: WithdrawalRequest;
  index: number;
  nextRebalanceTimestamp?: number;
};

const WithdrawalRequestRow = ({
  transaction,
  index,
  nextRebalanceTimestamp
}: Props) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const animationDuration = 0.1;
  const animationDelay = 0.025;
  const exitDuration = 0.085;

  const { data } = useGetAssetsList();

  const asset = useMemo(() => {
    const { isClaimed, restakingToken, assetOut } = transaction;
    const address = isClaimed ? assetOut : restakingToken;
    return data?.find((asset) => isEqualAddress(asset.address, address));
  }, [
    data,
    transaction.assetOut,
    transaction.isClaimed,
    transaction.restakingToken
  ]);

  const amount = transaction.isClaimed
    ? transaction.amountOut
    : transaction.amountIn;

  return (
    <AnimatePresence>
      <motion.tr
        className="flex w-full border-t border-t-border/40 dark:border-t-border/80 first:border-t-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: exitDuration } }}
        transition={{
          duration: animationDuration,
          delay: 0.25 + animationDelay * index
        }}
      >
        <td className="w-full flex flex-row justify-between items-center">
          <div className="w-full py-4 lg:py-2 flex flex-row justify-between items-center">
            <div className="flex flex-col items-start gap-1 px-4 lg:pl-6 whitespace-nowrap text-sm font-medium text-foregroundA11">
              <span className="mb-1 lg:mb-0 text-foreground/50">
                {dateFromTimestamp(+transaction.timestamp)}
              </span>
              {!isDesktopOrLaptop && (
                <TransactionStatusLabel
                  nextRebalanceTimestamp={nextRebalanceTimestamp}
                  transaction={transaction}
                  isLink={false}
                />
              )}
            </div>

            {isDesktopOrLaptop && (
              <div className="flex flex-row flex-1">
                <TransactionStatusLabel
                  nextRebalanceTimestamp={nextRebalanceTimestamp}
                  transaction={transaction}
                  isLink={false}
                />
              </div>
            )}

            <div className="px-4 lg:px-2 whitespace-nowrap text-sm flex items-center justify-end gap-4 font-medium">
              {amount && (
                <div className="text-foreground/50">
                  {displayEthAmount(amount)} {asset?.symbol}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-[unset] py-1.5"
              >
                <a
                  href={linkToTxOnBlockExplorer(
                    (transaction.claimTx || transaction.tx) as Hash,
                    CHAIN_ID
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>View</span>
                    <IconExternal />
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </td>
      </motion.tr>
    </AnimatePresence>
  );
};

export default WithdrawalRequestRow;
