import { twJoin } from 'tailwind-merge';
import { Address } from 'viem';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { IconEtherscan } from '../Icons/IconEtherscan';
import { MonospaceBox } from '../Shared/MonospaceBox';
import { cn, linkToAddressOnBlockExplorer } from '../../lib/utilities';
import { InfoTooltip, InfoTooltipProps } from './InfoTooltip';

export function ContractAddressField({
  title,
  value,
  onEdit,
  className,
  tooltipContent,
  tooltipProps,
  monospaceBoxClassName
}: {
  title: string | React.ReactNode;
  value?: string;
  onEdit?: () => void;
  className?: string;
  tooltipContent?: string | React.ReactNode;
  tooltipProps?: Omit<InfoTooltipProps, 'children'>;
  monospaceBoxClassName?: string;
}) {
  const { chain } = useAccountIfMounted();
  const explorerLink = value?.startsWith('0x')
    ? linkToAddressOnBlockExplorer(value as Address, chain?.id)
    : undefined;

  return (
    <div className={cn('w-full', className)}>
      <h4 className="flex text-xs font-medium leading-4 mb-1 space-x-0.5">
        <span className="opacity-50">{title}</span>
        {explorerLink && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 focus:opacity-100 rounded-full focus:ring-2 focus:ring-foreground focus:outline-0"
            href={explorerLink}
          >
            <IconEtherscan />
          </a>
        )}
        {tooltipContent && (
          <InfoTooltip {...tooltipProps} iconClassName="opacity-50">
            {tooltipContent}
          </InfoTooltip>
        )}
      </h4>
      <div className="relative flex w-full items-center gap-2 max-w-full">
        <MonospaceBox
          className={cn(
            'w-full text-[11px] font-semibold overflow-hidden max-w-full h-[41px]',
            monospaceBoxClassName
          )}
          value={value}
          copyable
        />
        {onEdit && (
          <button
            onClick={onEdit}
            className={twJoin(
              'flex items-center justify-center',
              'relative top-0 bottom-0 h-[41px] px-4',
              'rounded-md bg-primary leading-none text-primary-foreground text-sm font-semibold'
            )}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
