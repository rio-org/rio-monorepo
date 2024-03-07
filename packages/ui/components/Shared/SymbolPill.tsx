import React from 'react';
import { TokenSymbol } from '../../lib/typings';
import Skeleton from 'react-loading-skeleton';

type Props = {
  symbol?: TokenSymbol;
};

const SymbolPill = ({ symbol }: Props) => {
  if (!symbol) {
    return <Skeleton width={60} height={28} />;
  }
  return (
    <span className="bg-foregroundA1 rounded-[4px] text-[12px] px-2 py-1 min-w-[60px] text-center block text-foregroundA7 font-medium">
      {symbol}
    </span>
  );
};

export default SymbolPill;
