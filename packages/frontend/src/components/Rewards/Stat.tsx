import React from 'react';
import StatLabel from './StatLabel';
import { displayEthAmount } from '../../lib/utilities';

type Props = {
  label: string;
  value: string;
  denominator: string;
};

const Stat = ({ label, value, denominator }: Props) => {
  if (denominator === 'reETH') {
    value = displayEthAmount(value).toString();
  }
  return (
    <div className="bg-[var(--color-element-wrapper-bg)] p-4 lg:p-6 rounded-xl w-full flex flex-col gap-6">
      <StatLabel label={label} />
      <span className="text-[28px] leading-none">
        {value} {denominator}
      </span>
    </div>
  );
};

export default Stat;
