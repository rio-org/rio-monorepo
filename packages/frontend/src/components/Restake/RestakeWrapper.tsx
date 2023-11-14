import React from 'react';

type Props = {
  children: React.ReactNode;
  isWide?: boolean;
};

const RestakeWrapper = ({ children, isWide }: Props) => {
  const maxWidthClass = isWide ? `max-w-[1024px]` : 'lg:max-w-[588px]';
  return (
    <div className="h-full flex items-center justify-center">
      <div className={`w-full ${maxWidthClass}`}>{children}</div>
    </div>
  );
};

export default RestakeWrapper;
