import React from 'react';

type Props = {
  children: React.ReactNode;
};

const WithdrawWrapper = ({ children }: Props) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full lg:max-w-[588px]">{children}</div>
    </div>
  );
};

export default WithdrawWrapper;
