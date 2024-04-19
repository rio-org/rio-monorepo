import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader
} from '@material-tailwind/react';
import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { useCompleteContractWrite } from '@rio-monorepo/ui/hooks/useCompleteContractWrite';
import { RioTransactionType } from '@rio-monorepo/ui/lib/typings';
import { OperatorDelegator } from '@rionetwork/sdk-react';
import { useCallback, useEffect, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { Address, zeroAddress } from 'viem';

export function EditOperatorFieldDialog({
  functionName,
  value,
  onClose,
  refetchOperator,
  operatorRegistryAddress,
  operatorDelegator
}: {
  functionName?: 'setOperatorPendingManager' | 'setOperatorEarningsReceiver';
  value?: string;
  operatorRegistryAddress?: Address;
  onClose: () => void;
  refetchOperator: () => void;
  operatorDelegator: OperatorDelegator;
}) {
  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const [debouncedFxnName, setDebouncedFxnName] =
    useState<typeof functionName>();
  const isOpen = !!functionName;

  useEffect(() => setInputValue(value ?? ''), [value]);

  useEffect(() => {
    if (functionName) setDebouncedFxnName(functionName);
    const timeout = setTimeout(() => setDebouncedFxnName(functionName), 2000);
    return () => clearTimeout(timeout);
  }, [functionName]);

  const {
    status: { isTxPending, isUserSigning, txError },
    prepareContractWrite: { data: simulatedData },
    contractWrite: { writeContract, data: hash, reset }
  } = useCompleteContractWrite({
    address: isOpen ? operatorRegistryAddress ?? zeroAddress : undefined,
    abi: RioLRTOperatorRegistryABI,
    functionName: debouncedFxnName,
    args: [
      operatorDelegator.delegatorId,
      (inputValue as Address) || zeroAddress
    ],
    query: {
      enabled:
        !!isOpen &&
        !!debouncedFxnName &&
        !!inputValue &&
        /0x[a-fA-F0-9]{40}/.test(inputValue) &&
        inputValue !== zeroAddress
    }
  });
  const canCloseWindow = !isTxPending && !isUserSigning;

  const handleCloseWindow = useCallback(() => {
    if (canCloseWindow) {
      reset();
      refetchOperator();
      onClose();
    }
  }, [canCloseWindow, onClose, reset]);

  const fieldName =
    functionName === 'setOperatorEarningsReceiver'
      ? 'Earnings Receiver'
      : 'Operator Manager';

  return (
    <Dialog
      className="bg-foregroundA1 rounded-[16px] pt-0 pb-1 px-1"
      size="sm"
      open={isOpen}
      handler={handleCloseWindow}
    >
      <DialogHeader className="px-4 py-3 text-base font-medium">
        Update {fieldName}
      </DialogHeader>
      <DialogBody className="bg-card rounded-t-[14px] w-full px-4 pt-6 pb-4">
        <div className="w-full">
          <h5 className="flex text-xs font-medium leading-4 mb-1 opacity-75 space-x-0.5">
            <span>{fieldName}</span>
          </h5>
          <div className="relative flex w-full items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={twJoin(
                'w-full max-w-full h-[41px]',
                'text-[11px] font-mono font-semibold',
                'p-3 bg-input rounded-lg',
                'border border-transparent',
                'focus:border-border focus:outline-0'
              )}
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="bg-card rounded-b-[14px] w-full pt-0 px-3 pb-3">
        <p className="text-center w-full text-xs opacity-75">
          Note: Changing this field requires submitting a transaction
        </p>
        <TransactionButton
          transactionType={RioTransactionType.UPDATE_OPERATOR_VALUE}
          toasts={{
            sent: `Updating ${fieldName}`,
            error: `Failed to update ${fieldName}`,
            success: `Operator ${fieldName} updated`
          }}
          hash={hash}
          refetch={handleCloseWindow}
          disabled={isTxPending || isUserSigning || !simulatedData?.request}
          isSigning={isUserSigning}
          error={txError}
          reset={reset}
          clearErrors={reset}
          write={
            !simulatedData?.request
              ? undefined
              : () => writeContract(simulatedData.request)
          }
        >
          Submit
        </TransactionButton>
        <div className="flex justify-center w-full mt-3">
          <button
            className="bg-transparent text-sm"
            onClick={handleCloseWindow}
          >
            Close
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
