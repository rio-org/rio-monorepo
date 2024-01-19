import React from 'react';

type Props = {
  children: React.ReactNode;
};

const InlineErrorMessage = ({ children }: Props) => {
  return <span className="text-xs text-red-500">{children}</span>;
};

export default InlineErrorMessage;
