import React from 'react';
import cx from 'classnames';
import { type TableLabelProps } from '../../lib/typings';

export type Props = TableLabelProps;

export const TableLabel = ({
  children,
  textDirection = 'left',
  isSecondary
}: Props) => {
  return (
    <span
      className={cx(
        `block text-sm text-${textDirection} items-end font-medium leading-none w-full`,
        isSecondary && 'opacity-50'
      )}
    >
      {children}
    </span>
  );
};
