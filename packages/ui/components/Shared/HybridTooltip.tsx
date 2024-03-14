'use client';

import {
  type TooltipContentProps,
  type TooltipProps,
  type TooltipTriggerProps
} from '@radix-ui/react-tooltip';
import {
  type PopoverContentProps,
  type PopoverProps,
  type PopoverTriggerProps
} from '@radix-ui/react-popover';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '../shadcn/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '../shadcn/popover';
import { useIsTouch } from '../../contexts/TouchProvider';
import { cn } from '../../lib/utilities';

export const HybridTooltip = (props: TooltipProps & PopoverProps) => {
  const isTouch = useIsTouch();

  return isTouch ? (
    <Popover {...props} />
  ) : (
    <TooltipProvider>
      <Tooltip {...props} />
    </TooltipProvider>
  );
};

export const HybridTooltipTrigger = ({
  className,
  ...props
}: TooltipTriggerProps & PopoverTriggerProps) => {
  const isTouch = useIsTouch();

  return isTouch ? (
    <PopoverTrigger
      className={cn('focus:outline-2 focus:outline-foreground', className)}
      {...props}
    />
  ) : (
    <TooltipTrigger
      className={cn('focus:outline-2 focus:outline-foreground', className)}
      {...props}
    />
  );
};

export const HybridTooltipContent = (
  props: TooltipContentProps & PopoverContentProps
) => {
  const isTouch = useIsTouch();

  return isTouch ? (
    <PopoverContent {...props} />
  ) : (
    <TooltipContent {...props} />
  );
};
