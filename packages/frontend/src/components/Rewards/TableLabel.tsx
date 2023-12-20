import React from 'react';
import cx from 'classnames';

type Props = {
  children: React.ReactNode;
  textDirection?: 'left' | 'right';
  isSecondary?: boolean;
};

const TableLabel = ({
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

export default TableLabel;
