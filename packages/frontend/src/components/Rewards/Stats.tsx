import React, { useMemo, useState } from 'react';
import Stat from './Stat';
import { motion } from 'framer-motion';
import IconSelectArrow from '@rio-monorepo/ui/components/Icons/IconSelectArrow';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';

interface Props {
  lrt?: LRTDetails;
}

const Stats = ({ lrt }: Props) => {
  const isMounted = useIsMounted();
  const [isExpanded, setIsExpanded] = useState(true);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  const stats = useMemo(
    () => [
      { label: 'EigenLayer points', value: 'Coming soon', denominator: '' },
      {
        label: 'Average APY',
        value: `${lrt?.percentAPY?.toString()}%` || '--',
        denominator: ''
      }
    ],
    [lrt?.percentAPY]
  );

  return (
    <>
      {isMounted && !isDesktopOrLaptop && (
        <h1
          className="flex items-center justify-between mb-5 text-2xl cursor-pointer lg:cursor-default font-medium"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          Your rewards
          <IconSelectArrow direction={isExpanded ? 'up' : 'down'} />
        </h1>
      )}

      <motion.div
        className="w-full overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row gap-2 mb-6">
          {isMounted &&
            stats.map((stat, index) => (
              <Stat
                key={index}
                label={stat.label}
                value={stat.value}
                denominator={stat.denominator}
              />
            ))}
        </div>
      </motion.div>
    </>
  );
};

export default Stats;
