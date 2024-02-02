import { useCallback, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';
import { useLiquidRestakingToken } from '@rionetwork/sdk-react';
import { useSubgraphConstractWrite } from '@rio-monorepo/ui/hooks/useSubgraphContractWrite';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';
import { ClaimAmountViewer } from '@rio-monorepo/ui/components/Shared/ClaimAmountViewer';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import {
  type LRTDetails,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';

interface Props {
  lrt: LRTDetails;
}

export const ClaimEarningsForm = ({ lrt }: Partial<Props>) => {
  if (!lrt) {
    return (
      <div>
        <ClaimAmountViewer title="Earnings available to claim" />
        <motion.button className="rounded-full w-full py-3 mt-4 font-bold bg-black duration-200 bg-opacity-20">
          <Skeleton height="1rem" width={100} className="opacity-30" />
        </motion.button>
      </div>
    );
  }
  return <HydratedClaimEarningsForm lrt={lrt} />;
};

function HydratedClaimEarningsForm({ lrt }: Props) {
  const lrtClient = useLiquidRestakingToken(lrt.address);
  const { address } = useAccountIfMounted();
  const { data: operators } = useGetOperators(
    { where: { manager: address?.toLowerCase() } },
    { enabled: !!address }
  );

  const operator = operators?.[0];
  const amountToClaim = 0;

  const execute = useCallback(async () => {
    if (!lrtClient || !address || !operator) return;

    // TODO: Implement contract call to claim operator's Earnings

    return Promise.resolve(undefined);
  }, [lrtClient, address]);

  const onReset = useCallback(async () => {
    // TODO: Implement refetch / form clearing logic
  }, []);

  const canClaim = !!address && !!lrtClient && !!operator && !!amountToClaim;

  const { txHash, isLoading, error, success, write, reset } =
    useSubgraphConstractWrite({
      execute,
      onReset,
      enabled: canClaim,
      confirmations: 1
    });

  useEffect(() => void (success && onReset()), [success, onReset]);

  return (
    <div>
      <ClaimAmountViewer
        title="Earnings available to claim"
        amount={0}
        symbol="ETH"
      />

      <TransactionButton
        transactionType={RioTransactionType.CLAIM_EARNINGS}
        hash={txHash}
        refetch={onReset}
        disabled={!canClaim || isLoading}
        isSigning={isLoading}
        error={error}
        reset={reset}
        clearErrors={reset}
        write={write}
      >
        {isLoading
          ? 'Claiming'
          : !operator
          ? 'Must be operator manager to claim'
          : canClaim
          ? 'Claim'
          : 'Nothing available to claim'}
      </TransactionButton>
    </div>
  );
}
