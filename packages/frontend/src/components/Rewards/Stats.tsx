import React from 'react';
import { statsData } from '../../../placeholder';
import Stat from './Stat';

const Stats = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full mb-10">
      {statsData.map((stat, index) => (
        <Stat
          key={index}
          label={stat.label}
          value={stat.value}
          denominator={stat.denominator}
        />
      ))}
    </div>
  );
};

export default Stats;
