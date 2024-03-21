import { AnimatePresence, motion } from 'framer-motion';
import { OperatorDelegator } from '@rionetwork/sdk-react';
import { Address, zeroAddress } from 'viem';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { IconWarning } from '@rio-monorepo/ui/components/Icons/IconWarning';
import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';
import { useCompleteContractWrite } from '@rio-monorepo/ui/hooks/useCompleteContractWrite';
import { useEffect } from 'react';
import { Spinner } from '@material-tailwind/react';
import { isEqualAddress } from '@rio-monorepo/ui/lib/utilities';
import { twJoin } from 'tailwind-merge';

export function PendingManagerInvitation({
  pendingManager,
  isOpen,
  operatorDelegator,
  refetchOperator,
  operatorRegistryAddress
}: {
  pendingManager?: Address;
  isOpen: boolean;
  operatorDelegator: OperatorDelegator;
  refetchOperator: () => void;
  operatorRegistryAddress?: Address;
}) {
  const { address } = useAccountIfMounted();

  const {
    status: { isTxComplete, isTxPending, isUserSigning },
    prepareContractWrite: { data: simulatedData },
    contractWrite: { writeContract, reset }
  } = useCompleteContractWrite({
    address: operatorRegistryAddress ?? zeroAddress,
    abi: RioLRTOperatorRegistryABI,
    functionName: 'confirmOperatorManager',
    args: [operatorDelegator.delegatorId],
    query: {
      enabled:
        !!address &&
        !!operatorRegistryAddress &&
        pendingManager &&
        pendingManager !== zeroAddress &&
        isEqualAddress(address, pendingManager)
    }
  });

  useEffect(() => {
    if (!isTxComplete) return;
    refetchOperator();
  }, [isTxComplete, refetchOperator]);

  useEffect(() => {
    if (!isTxComplete) return;
    reset();
  }, [isTxComplete, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, marginBottom: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            marginBottom: '1.5rem',
            opacity: 1
          }}
          exit={{ height: 0, marginBottom: 0, opacity: 0 }}
          className="w-full flex justify-between gap-8 px-3 py-2 overflow-hidden bg-[#EDCD5E] rounded-md"
        >
          <div className="flex gap-2 items-center text-[14px] font-medium text-foreground">
            <IconWarning className="[&>path]:stroke-foreground" />
            <span className="leading-snug">
              Invitation to manage an operator
            </span>
          </div>
          <button
            disabled={
              isTxPending ||
              !writeContract ||
              !simulatedData?.request ||
              isUserSigning
            }
            className="relative py-1.5 px-2.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground"
            onClick={
              !simulatedData?.request
                ? undefined
                : () => writeContract(simulatedData.request)
            }
          >
            {(isTxPending || isUserSigning) && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Spinner width={14} height={14} />
              </span>
            )}
            <span
              className={twJoin((isTxPending || isUserSigning) && 'opacity-0')}
            >
              Accept
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
