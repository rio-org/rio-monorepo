import React from 'react';
import { type TableLabelProps } from '../../lib/typings';
import { cn } from '../../lib/utilities';

export type Props = TableLabelProps;

export const TableLabel = ({
  children,
  textDirection = 'left',
  isSecondary,
  className
}: Props) => {
  return (
    <span
      className={cn(
        `block text-sm text-${textDirection} items-end font-medium leading-none w-full`,
        isSecondary && 'opacity-50',
        className
      )}
    >
      {children}
    </span>
  );
};
