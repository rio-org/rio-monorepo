import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Stat from './Stat';
import IconSelectArrow from '@rio-monorepo/ui/components/Icons/IconSelectArrow';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
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
      {
        label: 'EigenLayer points',
        value: 'Coming soon',
        denominator: '',
        infoTooltipContent: (
          <p>
            The share of EigenLayer points that have been earned by this
            {" address's"} deposits.
          </p>
        )
      },
      {
        label: 'Average APY',
        value: `${lrt?.percentAPY?.toString() || '--'}%`,
        denominator: '',
        infoTooltipContent: (
          <p>
            The average <strong>Annual Percentage Yield (APY)</strong>{' '}
            calculated from the last 14 days extrapolated over the next 12
            months.
          </p>
        )
      }
    ],
    [lrt?.percentAPY]
  );

  return (
    <>
      <AnimatePresence>
        {isMounted && !isDesktopOrLaptop && (
          <motion.h1
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center justify-between mb-5 text-2xl cursor-pointer lg:cursor-default font-medium"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            Your rewards
            <IconSelectArrow direction={isExpanded ? 'up' : 'down'} />
          </motion.h1>
        )}
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          className="w-full overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          exit={{ height: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-2 mb-6">
            {stats.map((stat, index) => (
              <Stat
                key={index}
                label={stat.label}
                value={stat.value}
                denominator={stat.denominator}
                infoTooltipContent={stat.infoTooltipContent}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Stats;
