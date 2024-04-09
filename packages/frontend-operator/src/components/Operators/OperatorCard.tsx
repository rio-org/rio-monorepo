import { type OperatorDelegator } from '@rionetwork/sdk-react';
import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { twJoin, twMerge } from 'tailwind-merge';
import { type Address, zeroAddress } from 'viem';
import { useState } from 'react';
import dayjs from 'dayjs';

import { ContractAddressField } from '@rio-monorepo/ui/components/Shared/ContractAddressField';
import { IconCloudArrowDown } from '@rio-monorepo/ui/components/Icons/IconCloudArrowDown';
import { IconOpenAccordion } from '@rio-monorepo/ui/components/Icons/IconOpenAccordion';
import { IconCalendarClock } from '@rio-monorepo/ui/components/Icons/IconCalendarClock';
import { IconCloudArrowUp } from '@rio-monorepo/ui/components/Icons/IconCloudArrowUp';
import { IconCircleArrow } from '@rio-monorepo/ui/components/Icons/IconCircleArrow';
import { IconFileKey } from '@rio-monorepo/ui/components/Icons/IconFileKey';
import { IconSocialX } from '@rio-monorepo/ui/components/Icons/IconSocialX';
import { IconRocket } from '@rio-monorepo/ui/components/Icons/IconRocket';
import { IconGlobe } from '@rio-monorepo/ui/components/Icons/IconGlobe';
import { MonospaceBox } from '@rio-monorepo/ui/components/Shared/MonospaceBox';
import { LinkIcon } from '@rio-monorepo/ui/components/Shared/LinkIcon';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { ValidatorOptionsKabobMenu } from './ValidatorOptionsKabobMenu';
import { PendingManagerInvitation } from './PendingManagerInvitation';
import { NewManagerPendingSection } from './NewManagerPendingSection';
import { EditOperatorFieldDialog } from './EditOperatorFieldDialog';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { cn, isEqualAddress } from '@rio-monorepo/ui/lib/utilities';
import {
  type OperatorDetails,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';

interface Props {
  operatorRegistryAddress?: Address;
  operatorDelegator: OperatorDelegator;
  refetchOperator: () => void;
  editable?: boolean;
  className?: string;
  onchainDetail?: OperatorDetails | undefined;
  restakingToken?: LRTDetails;
}

export function OperatorCard({
  operatorRegistryAddress,
  operatorDelegator,
  refetchOperator,
  onchainDetail,
  editable
}: Props) {
  const { address } = useAccountIfMounted();
  const [isExpanded, setIsExpanded] = useState(false);
  const [updateFxnName, setUpdateFxnName] = useState<
    undefined | 'setOperatorPendingManager' | 'setOperatorEarningsReceiver'
  >();

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
  const confirmed =
    pastConfirmation && onchainDetail
      ? onchainDetail.validatorDetails.total
      : onchainDetail?.validatorDetails.confirmed;
  // const active = onchainDetail
  //   ? Math.min(
  //       (confirmed ?? 0) - onchainDetail.validatorDetails.exited,
  //       onchainDetail.validatorDetails.cap
  //     )
  //   : undefined;
  const active =
    Number(operatorDelegator.totalValidatorKeyCount) -
    Number(operatorDelegator.unusedValidatorKeyCount);
  const nextConfirmationDay = onchainDetail
    ? dayjs(onchainDetail.validatorDetails.nextConfirmationTimestamp * 1000)
    : undefined;

  return (
    <FormCard.Body className="gap-0">
      <PendingManagerInvitation
        pendingManager={onchainDetail?.pendingManager}
        isOpen={
          !!address &&
          !!onchainDetail &&
          !isEqualAddress(onchainDetail.pendingManager, zeroAddress) &&
          !isEqualAddress(onchainDetail.manager, address) &&
          isEqualAddress(onchainDetail.pendingManager, address)
        }
        operatorDelegator={operatorDelegator}
        refetchOperator={refetchOperator}
        operatorRegistryAddress={operatorRegistryAddress}
      />
      <OperatorBasicInfo
        operatorDelegator={operatorDelegator}
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
            <NewManagerPendingSection
              pendingManager={onchainDetail?.pendingManager}
              isOpen={
                !!editable &&
                !!onchainDetail?.pendingManager &&
                !!address &&
                !isEqualAddress(onchainDetail.pendingManager, address) &&
                !isEqualAddress(onchainDetail.pendingManager, zeroAddress)
              }
              operatorDelegator={operatorDelegator}
              refetchOperator={refetchOperator}
              operatorRegistryAddress={operatorRegistryAddress}
            />
            <div>
              <div
                className={twMerge(
                  'flex justify-between items-center w-full',
                  !!editable && 'justify-start'
                )}
              >
                <h3 className="text-sm font-medium leading-5 mb-2">
                  Validator Information
                </h3>
                {!editable && (
                  <ValidatorOptionsKabobMenu
                    operatorRegistryAddress={operatorRegistryAddress}
                    operatorDelegator={operatorDelegator}
                    refetchOperator={refetchOperator}
                    onchainDetail={onchainDetail}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <OperatorValidatorDetail
                  title="DAO Approved Cap"
                  icon={<IconCircleArrow direction="up" />}
                  value={onchainDetail?.validatorDetails?.cap}
                />
                <OperatorValidatorDetail
                  title="Active"
                  icon={<IconRocket />}
                  value={active}
                />
                <OperatorValidatorDetail
                  title="Deposited Keys"
                  icon={<IconCloudArrowUp />}
                  value={operatorDelegator.depositedValidatorKeyCount}
                />
                <OperatorValidatorDetail
                  title="Exited Keys"
                  icon={<IconCloudArrowDown />}
                  value={operatorDelegator.exitedValidatorKeyCount}
                />
                <OperatorValidatorDetail
                  title="Confirmed Keys"
                  icon={<IconCloudArrowUp />}
                  value={confirmed}
                />
                <OperatorValidatorDetail
                  title="Total Keys"
                  icon={<IconRocket />}
                  value={operatorDelegator.totalValidatorKeyCount}
                />
                {!!pending && (
                  <>
                    <OperatorValidatorDetail
                      title="Pending"
                      icon={<IconFileKey />}
                      value={pending}
                    />
                    <OperatorValidatorDetail
                      title="Next Confirmation"
                      icon={<IconCalendarClock />}
                      value={
                        !nextConfirmationDay ? undefined : (
                          <div className="text-[10px] leading-none">
                            <div>
                              {nextConfirmationDay.format('D MMM YYYY')}
                            </div>
                            <div>{nextConfirmationDay.format('hh:mm:ss')}</div>
                          </div>
                        )
                      }
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium leading-5 mb-2">Details</h3>
              <div className="space-y-2">
                <ContractAddressField
                  title="Address"
                  value={operatorDelegator.operator.address}
                />
                <ContractAddressField
                  title="Delegator"
                  value={operatorDelegator.address}
                />
                <ContractAddressField
                  title="Manager"
                  value={operatorDelegator.manager}
                  onEdit={
                    !editable
                      ? undefined
                      : () => setUpdateFxnName('setOperatorPendingManager')
                  }
                />
                <ContractAddressField
                  title="Earnings Receiver"
                  value={operatorDelegator.earningsReceiver}
                  onEdit={
                    !editable
                      ? undefined
                      : () => setUpdateFxnName('setOperatorEarningsReceiver')
                  }
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
              : operatorDelegator[
                  updateFxnName === 'setOperatorEarningsReceiver'
                    ? 'earningsReceiver'
                    : 'manager'
                ]
          }
          onClose={() => setUpdateFxnName(undefined)}
          operatorDelegator={operatorDelegator}
          refetchOperator={refetchOperator}
          operatorRegistryAddress={operatorRegistryAddress}
        />
      )}
    </FormCard.Body>
  );
}

function OperatorBasicInfo({
  operatorDelegator,
  isExpanded,
  setIsExpanded,
  className,
  ...props
}: {
  operatorDelegator: OperatorDelegator;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
} & Omit<React.ComponentProps<'div'>, 'children'>) {
  return (
    <div
      className={cn('flex flex-row justify-between items-center', className)}
      {...props}
    >
      <div className="flex w-full gap-4">
        <div className="w-[84px] h-[84px] aspect-square rounded-xl overflow-hidden shrink-0">
          {operatorDelegator.operator.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={
                operatorDelegator.operator.name || 'Rio Network Operator Logo'
              }
              src={operatorDelegator.operator.logo}
              className="max-w-[84px] max-h-[84px] object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold leading-5">
              {operatorDelegator.operator.name}
            </h2>
            <p className="line-clamp-2 opacity-50 leading-tight text-xs">
              {operatorDelegator.operator.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LinkIcon
              href={operatorDelegator.operator.website}
              icon={<IconGlobe />}
            />
            <LinkIcon
              href={operatorDelegator.operator.twitter}
              icon={<IconSocialX />}
            />
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

function OperatorValidatorDetail({
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
    <MonospaceBox className="w-full md:w-[calc(50%-0.25rem)] h-[42px] text-xs">
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
