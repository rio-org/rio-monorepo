import { AnimatePresence, motion } from 'framer-motion';
import { OperatorDelegator } from '@rionetwork/sdk-react';
import { Address, zeroAddress } from 'viem';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { ContractAddressField } from '@rio-monorepo/ui/components/Shared/ContractAddressField';
import { IconWarning } from '@rio-monorepo/ui/components/Icons/IconWarning';
import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';
import { useCompleteContractWrite } from '@rio-monorepo/ui/hooks/useCompleteContractWrite';
import { useEffect } from 'react';
import { Spinner } from '@material-tailwind/react';
import { isEqualAddress } from '@rio-monorepo/ui/lib/utilities';
import { twJoin } from 'tailwind-merge';

export function NewManagerPendingSection({
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
    address: isOpen ? operatorRegistryAddress ?? zeroAddress : undefined,
    abi: RioLRTOperatorRegistryABI,
    functionName: 'setOperatorPendingManager',
    args: [operatorDelegator.delegatorId, address || zeroAddress],
    query: {
      enabled:
        !!address &&
        !!operatorRegistryAddress &&
        pendingManager &&
        pendingManager !== zeroAddress &&
        !isEqualAddress(address, pendingManager)
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
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col gap-3 p-2 border border-warning-foreground rounded-lg bg-foregroundA1">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center text-[14px] font-medium text-warningborder-warning-foreground">
                <IconWarning className="[&>path]:stroke-warningborder-warning-foreground" />
                <span className="leading-snug">New Manager Pending</span>
              </div>
              <button
                disabled={
                  isTxPending || !simulatedData?.request || isUserSigning
                }
                className="relative py-1.5 px-2.5 text-xs font-medium rounded-lg bg-warning-foreground text-foreground"
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
                  className={twJoin(
                    (isTxPending || isUserSigning) && 'opacity-0'
                  )}
                >
                  Cancel
                </span>
              </button>
            </div>
            <p className="text-xs opacity-75">
              The manager address was recently updated and is pending
              confirmation. Once confirmed, this will be the new manager and the
              connected wallet will lose access.
            </p>
            <ContractAddressField
              title="New Manager Address"
              value={pendingManager}
              className="rounded-lg bg-background pt-4 px-3"
              monospaceBoxClassName="bg-background pt-0 px-0"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
