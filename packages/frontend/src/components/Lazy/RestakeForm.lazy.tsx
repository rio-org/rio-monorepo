import Skeleton from 'react-loading-skeleton';
import { RestakeFieldSkeleton } from './RestakeField.lazy';
import { type RestakeFormProps } from '@/components/Restake/RestakeForm';
import dynamic from 'next/dynamic';

export const RestakeForm = dynamic<RestakeFormProps>(
  () =>
    import('@/components/Restake/RestakeForm').then(
      (mod: { RestakeForm: React.FC<RestakeFormProps> }) => mod.RestakeForm
    ),
  { loading: RestakeFormSkeleton }
);

export function RestakeFormSkeleton() {
  return (
    <>
      <div className="w-full">
        <div className="flex items-center flex-col-reverse gap-2 w-full md:items-end md:flex-row md:gap-0">
          <div className="justify-center rounded-md text-muted-foreground h-[unset] flex items-end gap-0 bg-transparent w-full md:w-[unset] p-0'">
            <div className="flex flex-col flex-1">
              <div className="inline-flex items-center justify-center whitespace-nowrap font-medium rounded-sm ring-offset-background transition-all border-t border-l border-r text-foreground text-base text-medium px-4 py-[9px] rounded-b-none rounded-t-[4px] border-border text-opacity-100 bg-background bg-opacity-100 [&+div]:border-t-transparent !shadow-cardlight">
                <Skeleton width={30} height={14} className="max-w-full" />
              </div>
              <div className="bg-background h-[5px] w-full border-t border-border md:border-r-0 border-l" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="inline-flex items-center justify-center whitespace-nowrap font-medium rounded-sm ring-offset-background transition-all bg-foreground bg-opacity-[0.03] border-t border-l border-r border-transparent text-foreground text-opacity-40 text-base text-medium px-4 py-[9px] shadow-cardinactive rounded-b-none rounded-t-[4px]">
                <Skeleton width={30} height={14} className="max-w-full" />
              </div>
              <div className="bg-background h-[5px] w-full border-t border-border md:border-r-0 border-r" />
            </div>
          </div>

          <div className="flex flex-col items-end justify-end shrink-0 w-full md:shrink">
            <div className="flex justify-end items-center pl-3 w-full">
              <div className="flex justify-between items-center w-full md:justify-start md:w-[unset] gap-6 mb-4 md:mb-2">
                <Skeleton height={14} width={100} />
                <Skeleton height={14} width={100} className="md:hidden" />
              </div>
            </div>
            <div className="bg-background h-[5px] border-t border-border hidden md:block w-full rounded-tr-[4px] border-r shadow-cardlight" />
          </div>
        </div>

        <div className="p-4 rounded-md border border-border bg-card text-card-foreground shadow-cardlight w-full relative rounded-t-none rounded-b-[4px] border-t-0 space-y-4">
          <RestakeFieldSkeleton />
          <div className="flex flex-col items-center w-full md:flex-row">
            <div className="rounded-md border border-border bg-card text-card-foreground flex items-center gap-3 shadow-none flex-grow flex-shrink-0 flex-row justify-between py-[14px] px-[20px] md:flex-col md:justify-center basis-[calc(33%-32px)] mb-2 md:mb-0 md:mr-2 w-full md:w-[unset]">
              <div className="flex justify-center items-center max-w-full gap-2 text-foreground leading-none text-[14px] text-opacity-50 font-bold">
                <div className="flex items-center gap-1">
                  <span className="leading-none">
                    <Skeleton width={50} height={14} />
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center max-w-full gap-2 text-foreground leading-none text-base text-opacity-80 font-mono">
                <span className="leading-none w-full">
                  <Skeleton width={80} height={16} />
                </span>
              </div>
            </div>

            <div className="rounded-md border border-border bg-card text-card-foreground flex items-center gap-3 shadow-none flex-grow flex-shrink-0 flex-row justify-between py-[14px] px-[20px] md:flex-col md:justify-center w-full md:w-[unset] basis-[calc(33%-32px)] mt-2 md:mt-0 md:ml-2">
              <div className="flex justify-center items-center max-w-full gap-2 text-foreground leading-none text-[14px] text-opacity-50 font-bold">
                <div className="flex items-center gap-1">
                  <span className="leading-none">
                    <Skeleton width={50} height={14} />
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center max-w-full gap-2 text-foreground leading-none text-base text-opacity-80 font-mono">
                <span className="leading-none w-full">
                  <Skeleton width={80} height={16} />
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-border bg-card text-card-foreground flex items-center gap-3 shadow-none flex-grow flex-shrink-0 flex-row justify-between py-[14px] px-[20px] md:flex-row md:justify-between">
            <div className="flex justify-center items-center max-w-full gap-2 text-foreground leading-none text-[14px] text-opacity-50 font-bold">
              <div className="flex items-center gap-2 leading-none">
                <span>
                  <Skeleton width={50} height={14} />
                </span>
              </div>
              <div className="flex justify-center items-center w-full max-w-full gap-2 text-foreground leading-none text-base text-opacity-80 font-mono">
                <strong className="flex flex-row gap-2 items-center leading-none">
                  <Skeleton width={40} />
                </strong>
                <span className="leading-none">
                  <Skeleton className="w-6 h-3.5" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-full mt-4">
            <button
              disabled
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-4 w-full font-bold text-base py-3 leading-6 h-12 disabled:bg-opacity-20"
            >
              <Skeleton width={50} height={14} className="invert" />
            </button>
          </div>
        </div>
        {/* <TransactionButton
          {...(isRestakeTab
            ? {
                transactionType: RioTransactionType.DEPOSIT,
                toasts: {
                  sent: 'Restake transaction sent',
                  error: 'Failed to restake',
                  success: `Sucessfully restaked ${displayAmount(
                    Number(restakeInputAmount)
                  )} ${restakeForm.activeToken?.symbol ?? ''}`
                },
                refetch: restakeForm.refetchUserBalances,
                hash: restakeWrite.txHash,
                disabled:
                  !restakeForm.isValidAmount ||
                  restakeForm.isEmpty ||
                  restakeWrite.isLoading,
                isSigning: restakeWrite.isLoading,
                error: restakeWrite.error,
                reset: restakeForm.resetForm,
                clearErrors: restakeForm.clearErrors,
                write: restakeWrite.write
              }
            : {
                transactionType: RioTransactionType.WITHDRAW_REQUEST,
                toasts: {
                  sent: `Withdrawal request sent`,
                  success: `Sucessfully requested to unstake ${withdrawInputAmount} ${lrtDetails?.symbol}`,
                  error: `An error occurred requesting withdrawal`
                },
                hash: withdrawWrite.txHash,
                refetch: withdrawForm.refetch,
                disabled:
                  !address ||
                  !withdrawForm.amount ||
                  !withdrawForm.isValidAmount ||
                  withdrawWrite.isLoading,
                isSigning: withdrawWrite.isLoading,
                error: withdrawWrite.error,
                reset: withdrawForm.resetForm,
                clearErrors: withdrawWrite.reset,
                write: withdrawWrite.write
              })}
        >
          {isRestakeTab ? 'Restake' : 'Request withdrawal'}
        </TransactionButton>
        {!restakeForm.isAllowed && address && (
          <ApproveButtons
            allowanceTarget={restakeForm.allowanceTarget}
            accountAddress={address}
            isValidAmount={restakeForm.isValidAmount}
            amount={restakeForm.amount || BigInt(0)}
            token={restakeForm.activeToken}
            refetchAllowance={restakeForm.handleRefetchAllowance}
          />
        )}
        {restakeForm.allowanceNote && (
          <p className="text-sm text-center px-2 mt-2 text-foregroundA8 font-normal">
            {restakeForm.allowanceNote}
          </p>
        )}
      </TabCard> */}
      </div>
    </>
  );
}
