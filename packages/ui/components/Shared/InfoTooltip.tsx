import { TooltipContentProps } from '@radix-ui/react-tooltip';
import { IconInfo } from '../Icons/IconInfo';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent
} from '../shadcn/tooltip';

export const InfoTooltip = ({
  triggerClassName,
  iconClassName,
  contentClassName,
  side = 'top',
  align = 'end',
  children
}: {
  triggerClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  side?: TooltipContentProps['side'];
  align?: TooltipContentProps['align'];
  children: React.ReactNode | React.ReactNode[];
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className={triggerClassName}>
        <IconInfo className={iconClassName} />
      </TooltipTrigger>
      <TooltipContent side={side} align={align} className={contentClassName}>
        {children}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
