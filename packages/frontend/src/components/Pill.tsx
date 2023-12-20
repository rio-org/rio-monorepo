import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Pill = ({ children }: Props) => {
  return (
    <span className="text-sm uppercase rounded-full border border-blue-gray-200 py-[6px] px-4">
      {children}
    </span>
  );
};

export default Pill;
