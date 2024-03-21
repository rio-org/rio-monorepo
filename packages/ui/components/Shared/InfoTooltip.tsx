import { TooltipContentProps } from '@radix-ui/react-tooltip';
import { IconInfo } from '../Icons/IconInfo';
import {
  HybridTooltip,
  HybridTooltipTrigger,
  HybridTooltipContent
} from './HybridTooltip';
import { cn } from '../../lib/utilities';

export type InfoTooltipProps = {
  triggerClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  side?: TooltipContentProps['side'];
  align?: TooltipContentProps['align'];
  children: React.ReactNode | React.ReactNode[];
};

export const InfoTooltip = ({
  triggerClassName,
  iconClassName,
  contentClassName,
  side = 'top',
  align = 'end',
  children
}: InfoTooltipProps) => (
  <HybridTooltip>
    <HybridTooltipTrigger className={cn('rounded-full', triggerClassName)}>
      <IconInfo className={cn('rounded-full', iconClassName)} />
    </HybridTooltipTrigger>
    <HybridTooltipContent
      side={side}
      align={align}
      className={cn('w-fit', contentClassName)}
    >
      {children}
    </HybridTooltipContent>
  </HybridTooltip>
);
