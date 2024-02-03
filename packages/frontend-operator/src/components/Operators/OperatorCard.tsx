import { Operator, useLiquidRestakingToken } from '@rionetwork/sdk-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Address, useContractRead } from 'wagmi';
import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';
import { zeroAddress } from 'viem';
import { useState } from 'react';
import dayjs from 'dayjs';
import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { IconOpenAccordion } from '@rio-monorepo/ui/components/Icons/IconOpenAccordion';
import { IconCloudArrowDown } from '@rio-monorepo/ui/components/Icons/IconCloudArrowDown';
import { IconCalendarClock } from '@rio-monorepo/ui/components/Icons/IconCalendarClock';
import { IconCloudArrowUp } from '@rio-monorepo/ui/components/Icons/IconCloudArrowUp';
import { IconCircleArrow } from '@rio-monorepo/ui/components/Icons/IconCircleArrow';
import { IconEtherscan } from '@rio-monorepo/ui/components/Icons/IconEtherscan';
import { IconFileKey } from '@rio-monorepo/ui/components/Icons/IconFileKey';
import { IconSocialX } from '@rio-monorepo/ui/components/Icons/IconSocialX';
import { IconRocket } from '@rio-monorepo/ui/components/Icons/IconRocket';
import { IconGlobe } from '@rio-monorepo/ui/components/Icons/IconGlobe';
import { IconCopy } from '@rio-monorepo/ui/components/Icons/IconCopy';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import {
  cn,
  linkToAddressOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';

interface ExternalProps {
  operator: Operator;
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

interface InnterProps extends ExternalPropsWithoutRestakingToken {
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
  operatorRegistryAddress
}: InnterProps) {
  const [isOpen, setIsOpen] = useState(false);
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
              <LinkIcon href={operator.website} icon={<IconGlobe />} />
              <LinkIcon href={operator.twitter} icon={<IconSocialX />} />
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsOpen && setIsOpen(!isOpen)}
            className={twJoin(
              'flex justify-center items-center',
              'min-w-6 max-w-6 min-h-6 max-h-6'
            )}
          >
            <IconOpenAccordion expanded={isOpen} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
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
              <h3 className="text-sm font-medium leading-5 mb-2">
                Validator Information
              </h3>
              <div className="space-y-2">
                <OperatorDetails title="Address" value={operator.address} />
                <OperatorDetails title="Delegator" value={operator.delegator} />
                <OperatorDetails title="Manager" value={operator.manager} />
                <OperatorDetails
                  title="Earnings Receiver"
                  value={operator.earningsReceiver}
                />
                <OperatorDetails
                  title="Metadata URI"
                  value={operator.metadataURI}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FormCard.Body>
  );
}

function MonospaceBox({
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        twJoin(
          'flex items-center justify-between',
          'px-3 py-3 rounded-lg bg-gray-200 bg-opacity-50',
          'font-mono'
        ),
        className
      )}
      {...props}
    />
  );
}

function OperatorDetails({
  title,
  value
}: {
  title: string | React.ReactNode;
  value: string;
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
      <div className="flex w-full items-center gap-2">
        <MonospaceBox className="w-full text-[11px] font-semibold overflow-hidden max-w-full">
          <span className="max-w-[calc(100%-1.5rem)] whitespace-nowrap text-ellipsis overflow-hidden">
            {value}
          </span>
          <button
            className="w-3 h-3 min-w-3 min-h-3"
            onClick={() => {
              navigator.clipboard.writeText(value).catch(console.error);
            }}
          >
            <IconCopy />
          </button>
        </MonospaceBox>
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

function LinkIcon({
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
