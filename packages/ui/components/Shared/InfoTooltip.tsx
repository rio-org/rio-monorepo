import { TooltipContentProps } from '@radix-ui/react-tooltip';
import { IconInfo } from '../Icons/IconInfo';
import {
  HybridTooltip,
  HybridTooltipTrigger,
  HybridTooltipContent
} from './HybridTooltip';

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
    <HybridTooltipTrigger className={triggerClassName}>
      <IconInfo className={iconClassName} />
    </HybridTooltipTrigger>
    <HybridTooltipContent
      side={side}
      align={align}
      className={contentClassName}
    >
      {children}
    </HybridTooltipContent>
  </HybridTooltip>
);
