import { IconWrench } from '@rio-monorepo/ui/components/Icons/IconWrench';
import { IconBoxX } from '@rio-monorepo/ui/components/Icons/IconBoxX';
import {
  KabobMenu,
  KabobMenuItem
} from '@rio-monorepo/ui/components/Shared/KabobMenu';
import {
  OperatorDetails,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';
import { useCallback, useState } from 'react';
import { Address, zeroAddress } from 'viem';
import { OperatorDelegator } from '@rionetwork/sdk-react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { useCompleteContractWrite } from '@rio-monorepo/ui/hooks/useCompleteContractWrite';
import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';

interface Props {
  operatorDelegator: OperatorDelegator;
  operatorRegistryAddress?: Address;
  refetchOperator: () => void;
  onchainDetail?: OperatorDetails | undefined;
}

export function ValidatorOptionsKabobMenu({
  operatorRegistryAddress,
  operatorDelegator,
  refetchOperator,
  onchainDetail
}: Props) {
  const [validatorMenuOpen, setValidatorMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const now = Date.now();
  const pastConfirmation = onchainDetail
    ? onchainDetail.validatorDetails.nextConfirmationTimestamp * 1000 <= now
    : false;
  const pending =
    pastConfirmation && onchainDetail
      ? 0
      : onchainDetail
      ? onchainDetail.validatorDetails.total -
        onchainDetail.validatorDetails.confirmed
      : undefined;

  const {
    status: { isTxPending, isUserSigning, txError },
    prepareContractWrite: { data: simulatedData },
    contractWrite: { writeContract, data: hash, reset }
  } = useCompleteContractWrite({
    address: operatorRegistryAddress ?? zeroAddress,
    abi: RioLRTOperatorRegistryABI,
    functionName: 'removeValidatorDetails',
    args: [
      operatorDelegator.delegatorId,
      BigInt(onchainDetail?.validatorDetails.confirmed || 0),
      BigInt(pending || 0)
    ],
    query: {
      enabled:
        !!onchainDetail &&
        !!pending &&
        !!operatorRegistryAddress &&
        !!operatorDelegator
    }
  });
  const canCloseWindow = !isTxPending && !isUserSigning;

  const handleOpenDialog = useCallback(() => {
    setValidatorMenuOpen(false);
    setTimeout(() => setDialogOpen(true), 200);
  }, []);

  const handleCloseDialog = useCallback(() => {
    if (canCloseWindow) {
      reset();
      refetchOperator();
      setDialogOpen(false);
    }
  }, [canCloseWindow, reset]);

  return (
    <>
      <KabobMenu
        placement="bottom-end"
        open={validatorMenuOpen}
        handler={setValidatorMenuOpen}
        title={
          <div className="flex items-center gap-1 opacity-40">
            <IconWrench
              width={14}
              height={14}
              className="[&>path]:fill-current [&>path]:stroke-transparent"
            />
            <span className="text-sm font-semibold">Validator options</span>
          </div>
        }
      >
        {!!pending && (
          <KabobMenuItem autoFocus onClick={handleOpenDialog}>
            <IconBoxX
              height={14}
              width={14}
              className="[&>path]:stroke-[#CC4C56]"
            />
            <span className="text-[13px] leading-none">
              Remove {pending} pending keys
            </span>
          </KabobMenuItem>
        )}
        {!pending && (
          <KabobMenuItem disabled>
            <IconBoxX
              height={14}
              width={14}
              className="[&>path]:stroke-black"
            />
            <span className="text-[13px] leading-none">
              No pending keys to remove
            </span>
          </KabobMenuItem>
        )}
      </KabobMenu>

      <Dialog
        className="bg-foregroundA1 rounded-[16px] pt-0 pb-1 px-1"
        size="sm"
        open={dialogOpen}
        handler={setDialogOpen}
      >
        <DialogHeader className="px-4 py-3 text-base font-medium">
          Remove All Pending Validator Keys
        </DialogHeader>
        <DialogBody className="bg-card text-card-foreground  rounded-t-[14px] w-full px-4 pt-6 pb-4">
          <p className="w-full text-sm mb-2 opacity-75">
            You are removing {pending} pending validator keys. This operation
            cannot be undone. If you want to re-add these keys for your
            Operator, you will have to submit them through the Key Submitter
            form again.
          </p>
        </DialogBody>
        <DialogFooter className="bg-card rounded-b-[14px] w-full pt-0 px-3 pb-3">
          <p className="text-center w-full text-xs opacity-50 text-card-foreground">
            Note: Continuing with this action requires submitting a transaction
          </p>
          <TransactionButton
            transactionType={RioTransactionType.UPDATE_OPERATOR_VALUE}
            toasts={{
              sent: `Removing ${pending ?? ''} pending keys`,
              error: `Failed to remove ${pending ?? ''} pending keys`,
              success: `Pending keys removed`
            }}
            hash={hash}
            refetch={handleCloseDialog}
            disabled={isTxPending || isUserSigning}
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
              className="bg-transparent text-sm text-card-foreground opacity-50"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
}
