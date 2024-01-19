import React, { useMemo } from 'react';
import StatLabel from './StatLabel';
import { displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
import { twJoin } from 'tailwind-merge';

type Props = {
  label: string;
  value: string;
  denominator: string;
};

const Stat = ({ label, value, denominator }: Props) => {
  const _value = useMemo(() => {
    if (isNaN(Number(value))) {
      return value;
    }

    if (/eth/i.test(denominator)) {
      return displayEthAmount(value).toString();
    }

    if (denominator === '') {
      return (+value).toLocaleString();
    }

    return value;
  }, [value, denominator]);

  return (
    <div
      className={twJoin(
        'flex flex-col gap-6 w-full rounded-xl',
        'p-4 lg:p-6',
        'bg-[var(--color-element-wrapper-bg)]'
      )}
    >
      <StatLabel label={label} />
      <span className="text-[28px] leading-none">
        {_value} {denominator}
      </span>
    </div>
  );
};

export default Stat;
