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
import { Tooltip, TooltipTrigger, TooltipContent } from '../shadcn/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '../shadcn/popover';
import { useTouch } from '../../contexts/TouchProvider';

export const HybridTooltip = (props: TooltipProps & PopoverProps) => {
  const isTouch = useTouch();

  return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

export const HybridTooltipTrigger = (
  props: TooltipTriggerProps & PopoverTriggerProps
) => {
  const isTouch = useTouch();

  return isTouch ? (
    <PopoverTrigger {...props} />
  ) : (
    <TooltipTrigger {...props} />
  );
};

export const HybridTooltipContent = (
  props: TooltipContentProps & PopoverContentProps
) => {
  const isTouch = useTouch();

  return isTouch ? (
    <PopoverContent {...props} />
  ) : (
    <TooltipContent {...props} />
  );
};
