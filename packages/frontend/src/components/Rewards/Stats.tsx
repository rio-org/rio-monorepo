import React, { useEffect, useState } from 'react';
import { statsData, emptyStatsData } from '../../../placeholder';
import Stat from './Stat';
import { motion } from 'framer-motion';
import IconSelectArrow from '../Icons/IconSelectArrow';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { useAccount } from 'wagmi';

const Stats = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { address } = useAccount();
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          {/* TODO: replace statsData with live data when available. currently pulling from placeholder.ts */}
          {isMounted && address
            ? statsData.map((stat, index) => (
                <Stat
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  denominator={stat.denominator}
                />
              ))
            : emptyStatsData.map((stat, index) => (
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
