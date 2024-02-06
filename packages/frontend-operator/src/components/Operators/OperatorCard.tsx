import { Operator, useLiquidRestakingToken } from '@rionetwork/sdk-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Address, useContractRead } from 'wagmi';
import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';
import { zeroAddress } from 'viem';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react';

import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';
import { IconOpenAccordion } from '@rio-monorepo/ui/components/Icons/IconOpenAccordion';
import { IconCloudArrowDown } from '@rio-monorepo/ui/components/Icons/IconCloudArrowDown';
import { IconCalendarClock } from '@rio-monorepo/ui/components/Icons/IconCalendarClock';
import { IconCloudArrowUp } from '@rio-monorepo/ui/components/Icons/IconCloudArrowUp';
import { IconCircleArrow } from '@rio-monorepo/ui/components/Icons/IconCircleArrow';
import { IconEtherscan } from '@rio-monorepo/ui/components/Icons/IconEtherscan';
import { MonospaceBox } from '@rio-monorepo/ui/components/Shared/MonospaceBox';
import { IconFileKey } from '@rio-monorepo/ui/components/Icons/IconFileKey';
import { IconSocialX } from '@rio-monorepo/ui/components/Icons/IconSocialX';
import { IconRocket } from '@rio-monorepo/ui/components/Icons/IconRocket';
import { IconGlobe } from '@rio-monorepo/ui/components/Icons/IconGlobe';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { linkToAddressOnBlockExplorer } from '@rio-monorepo/ui/lib/utilities';
import {
  RioTransactionType,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import { useCompleteContractWrite } from '@rio-monorepo/ui/hooks/useCompleteContractWrite';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';

interface ExternalProps {
  operator: Operator;
  refetchOperator: () => void;
  editable?: boolean;
  className?: string;
  restakingToken?: LRTDetails;
}

interface ExternalPropsWithoutRestakingToken
  extends Omit<ExternalProps, 'restakingToken'> {}

interface ExternalPropsWithForcedRestakingToken
  extends ExternalPropsWithoutRestakingToken {
  restakingToken: LRTDetails;
}

interface InnerProps extends ExternalPropsWithoutRestakingToken {
  operatorRegistryAddress?: Address;
}

export function OperatorCard({ restakingToken, ...props }: ExternalProps) {
  if (restakingToken) {
    return <OperatorCardWithLRT {...props} restakingToken={restakingToken} />;
  }
  return <OperatorCardBase {...props} />;
}

export function OperatorCardWithLRT({
  restakingToken,
  ...props
}: ExternalPropsWithForcedRestakingToken) {
  const lrt = useLiquidRestakingToken(restakingToken.address);
  return (
    <OperatorCardBase
      {...props}
      operatorRegistryAddress={
        lrt?.token?.deployment.operatorRegistry as Address | undefined
      }
    />
  );
}

export function OperatorCardBase({
  operator,
  operatorRegistryAddress,
  refetchOperator,
  editable
}: InnerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updateFxnName, setUpdateFxnName] = useState<
    undefined | 'setOperatorPendingManager' | 'setOperatorEarningsReceiver'
  >();
  const { data } = useContractRead({
    address: operatorRegistryAddress ?? zeroAddress,
    abi: RioLRTOperatorRegistryABI,
    functionName: 'getOperatorDetails',
    args: [operator.operatorId],
    enabled: !!operatorRegistryAddress,
    staleTime: 1000 * 60 * 5
  });

  return (
    <FormCard.Body className="gap-0">
      <OperatorBasicInfo
        operator={operator}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, marginTop: 0, opacity: 0 }}
            animate={{ height: 'auto', marginTop: '2rem', opacity: 1 }}
            exit={{ height: 0, marginTop: 0, opacity: 0 }}
            className="w-full flex flex-col gap-8 overflow-hidden"
          >
            <div>
              <h3 className="text-sm font-medium leading-5 mb-2">
                Validator Information
              </h3>
              <div className="flex flex-wrap gap-2">
                <ValidatorDetail
                  title="DAO Approved Cap"
                  icon={<IconCircleArrow direction="up" />}
                  value={data?.validatorDetails?.cap}
                />
                <ValidatorDetail
                  title="Active Validators"
                  icon={<IconRocket />}
                  value={
                    data?.validatorDetails &&
                    data.validatorDetails.deposited -
                      data.validatorDetails.exited
                  }
                />
                <ValidatorDetail
                  title="Confirmed"
                  subTitle="(All Time)"
                  icon={<IconCloudArrowUp />}
                  value={data?.validatorDetails.deposited}
                />
                <ValidatorDetail
                  title="Exited"
                  subTitle="(All Time)"
                  icon={<IconCloudArrowDown />}
                  value={data?.validatorDetails.exited}
                />
                <ValidatorDetail
                  title="Pending"
                  icon={<IconFileKey />}
                  value={
                    data?.validatorDetails &&
                    data.validatorDetails.total -
                      data.validatorDetails.confirmed
                  }
                />
                <ValidatorDetail
                  title="Next Confirmation"
                  icon={<IconCalendarClock />}
                  value={
                    !data?.validatorDetails
                      ?.nextConfirmationTimestamp ? undefined : (
                      <div className="text-[10px] leading-none">
                        <div>
                          {dayjs(
                            data.validatorDetails.nextConfirmationTimestamp *
                              1000
                          ).format('D MMM YYYY')}
                        </div>
                        <div>
                          {dayjs(
                            data.validatorDetails.nextConfirmationTimestamp *
                              1000
                          ).format('hh:mm:ss')}
                        </div>
                      </div>
                    )
                  }
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium leading-5 mb-2">Details</h3>
              <div className="space-y-2">
                <OperatorField title="Address" value={operator.address} />
                <OperatorField title="Delegator" value={operator.delegator} />
                <OperatorField
                  title="Manager"
                  value={operator.manager}
                  onEdit={
                    !editable
                      ? undefined
                      : () => setUpdateFxnName('setOperatorPendingManager')
                  }
                />
                <OperatorField
                  title="Earnings Receiver"
                  value={operator.earningsReceiver}
                  onEdit={
                    !editable
                      ? undefined
                      : () => setUpdateFxnName('setOperatorEarningsReceiver')
                  }
                />
                <OperatorField
                  title="Metadata URI"
                  value={operator.metadataURI}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {editable && (
        <EditOperatorFieldDialog
          functionName={updateFxnName}
          value={
            !updateFxnName
              ? undefined
              : operator[
                  updateFxnName === 'setOperatorEarningsReceiver'
                    ? 'earningsReceiver'
                    : 'manager'
                ]
          }
          onClose={() => setUpdateFxnName(undefined)}
          operator={operator}
          refetchOperator={refetchOperator}
          operatorRegistryAddress={operatorRegistryAddress}
        />
      )}
    </FormCard.Body>
  );
}

function EditOperatorFieldDialog({
  functionName,
  value,
  onClose,
  refetchOperator,
  operatorRegistryAddress,
  operator
}: {
  functionName?: 'setOperatorPendingManager' | 'setOperatorEarningsReceiver';
  value?: string;
  operatorRegistryAddress?: Address;
  onClose: () => void;
  refetchOperator: () => void;
  operator: Operator;
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
    contractWrite: { write, data, reset }
  } = useCompleteContractWrite({
    address: operatorRegistryAddress ?? zeroAddress,
    abi: RioLRTOperatorRegistryABI,
    functionName: debouncedFxnName,
    args: [operator.operatorId, (inputValue as Address) || zeroAddress],
    enabled:
      !!debouncedFxnName &&
      !!inputValue &&
      /0x[a-fA-F0-9]{40}/.test(inputValue) &&
      inputValue !== zeroAddress
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
      className="bg-[var(--color-element-wrapper-bg)] rounded-[16px] pt-0 pb-1 px-1"
      size="sm"
      open={isOpen}
      handler={handleCloseWindow}
    >
      <DialogHeader className="px-4 py-3 text-base font-medium">
        Update {fieldName}
      </DialogHeader>
      <DialogBody className="bg-white rounded-t-[14px] w-full px-4 pt-6 pb-4">
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
                'p-3 bg-gray-200 rounded-lg',
                'border border-transparent',
                'focus:border-gray-400 focus:outline-0'
              )}
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="bg-white rounded-b-[14px] w-full pt-0 px-3 pb-3">
        <p className="text-center w-full text-xs opacity-75">
          Note: Changing this field requires submitting a transaction
        </p>
        <TransactionButton
          transactionType={RioTransactionType.UPDATE_OPERATOR_VALUE}
          hash={data?.hash}
          refetch={handleCloseWindow}
          disabled={isTxPending || isUserSigning}
          isSigning={isUserSigning}
          error={txError}
          reset={reset}
          clearErrors={reset}
          write={write}
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

function OperatorBasicInfo({
  operator,
  isExpanded,
  setIsExpanded
}: {
  operator: Operator;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex w-full gap-4">
        <div className="w-[84px] h-[84px] aspect-square rounded-xl overflow-hidden shrink-0">
          {operator.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={operator.name || 'Rio Network Operator Logo'}
              src={operator.logo}
              className="max-w-[84px] max-h-[84px] object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold leading-5">{operator.name}</h2>
            <p className="line-clamp-2 opacity-50 leading-tight text-xs">
              {operator.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLinkIcon href={operator.website} icon={<IconGlobe />} />
            <ExternalLinkIcon href={operator.twitter} icon={<IconSocialX />} />
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={() => setIsExpanded && setIsExpanded(!isExpanded)}
          className={twJoin(
            'flex justify-center items-center',
            'min-w-6 max-w-6 min-h-6 max-h-6'
          )}
        >
          <IconOpenAccordion expanded={isExpanded} />
        </button>
      </div>
    </div>
  );
}

function OperatorField({
  title,
  value,
  onEdit
}: {
  title: string | React.ReactNode;
  value: string;
  onEdit?: () => void;
}) {
  const explorerLink = value.startsWith('0x')
    ? linkToAddressOnBlockExplorer(value as Address, CHAIN_ID)
    : undefined;

  return (
    <div className="w-full">
      <h4 className="flex text-xs font-medium leading-4 mb-1 opacity-50 space-x-0.5">
        <span>{title}</span>
        {explorerLink && (
          <a target="_blank" rel="noopener noreferrer" href={explorerLink}>
            <IconEtherscan />
          </a>
        )}
      </h4>
      <div className="relative flex w-full items-center gap-2">
        <MonospaceBox
          className="w-full text-[11px] font-semibold overflow-hidden max-w-full h-[41px]"
          value={value}
          copyable
        />
        {onEdit && (
          <button
            onClick={onEdit}
            className={twJoin(
              'flex items-center justify-center',
              'relative top-0 bottom-0  h-[41px] px-4',
              'rounded-md bg-black text-white text-sm font-semibold'
            )}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function ValidatorDetail({
  title,
  subTitle,
  icon,
  value
}: {
  title: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  value?: string | number | React.ReactNode;
}) {
  return (
    <MonospaceBox className="w-full lg:w-[calc(50%-0.25rem)] h-[42px] text-xs">
      <div className="flex items-center gap-2">
        {icon}
        <span className="opacity-75 font-[500] text-[11px] space-x-0.5">
          <span>{title}</span>
          {subTitle && <span className="opacity-75">{subTitle}</span>}
        </span>
      </div>
      <span className="font-bold text-right">
        {value ?? <Skeleton height={12} width={40} />}
      </span>
    </MonospaceBox>
  );
}

function ExternalLinkIcon({
  href,
  icon
}: {
  href?: string | null;
  icon: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {icon}
    </a>
  );
}
