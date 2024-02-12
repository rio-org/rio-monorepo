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

export const HybridTooltipTrigger = (
  props: TooltipTriggerProps & PopoverTriggerProps
) => {
  const isTouch = useIsTouch();

  return isTouch ? (
    <PopoverTrigger {...props} />
  ) : (
    <TooltipTrigger {...props} />
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
