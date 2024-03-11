import React, { useMemo } from 'react';
import StatLabel from './StatLabel';
import { Card } from '@rio-monorepo/ui/components/shadcn/card';
import { displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
import { twJoin } from 'tailwind-merge';

type Props = {
  label: string;
  value: string;
  denominator: string;
  infoTooltipContent?: React.ReactNode | React.ReactNode[];
};

const Stat = ({ label, value, denominator, infoTooltipContent }: Props) => {
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
    <Card className={twJoin('flex flex-col gap-6 w-full', 'p-4 md:p-6')}>
      <StatLabel label={label} infoTooltipContent={infoTooltipContent} />
      <span className="flex text-[28px] leading-none">
        {_value} {denominator}
      </span>
    </Card>
  );
};

export default Stat;
