import React from 'react';

type Props = {
  label: string;
};

const StatLabel = ({ label }: Props) => {
  return (
    <span className="bg-transparent text-[12px] text-black rounded-full py-[4px] px-3 border border-[var(--color-gray-stroke)] flex w-fit">
      {label}
    </span>
  );
};

export default StatLabel;
