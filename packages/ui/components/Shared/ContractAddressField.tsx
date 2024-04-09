import { twJoin } from 'tailwind-merge';
import { Address } from 'viem';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { IconEtherscan } from '../Icons/IconEtherscan';
import { MonospaceBox } from '../Shared/MonospaceBox';
import { cn, linkToAddressOnBlockExplorer } from '../../lib/utilities';
import { InfoTooltip } from './InfoTooltip';

export function ContractAddressField({
  title,
  value,
  onEdit,
  className,
  tooltipContent,
  monospaceBoxClassName
}: {
  title: string | React.ReactNode;
  value?: string;
  onEdit?: () => void;
  className?: string;
  tooltipContent?: string | React.ReactNode;
  monospaceBoxClassName?: string;
}) {
  const { chain } = useAccountIfMounted();
  const explorerLink = value?.startsWith('0x')
    ? linkToAddressOnBlockExplorer(value as Address, chain?.id)
    : undefined;

  return (
    <div className={cn('w-full', className)}>
      <h4 className="flex text-xs font-medium leading-4 mb-1 opacity-50 space-x-0.5">
        <span>{title}</span>
        {tooltipContent && (
          <InfoTooltip iconClassName="opacity-50">{tooltipContent}</InfoTooltip>
        )}
        {explorerLink && (
          <a target="_blank" rel="noopener noreferrer" href={explorerLink}>
            <IconEtherscan />
          </a>
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
