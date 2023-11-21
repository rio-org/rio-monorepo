import React from 'react';
import { TokenSymbol } from '../../lib/typings';

type Props = {
  symbol: TokenSymbol;
};

const SymbolPill = ({ symbol }: Props) => {
  return (
    <span className="bg-[var(--color-element-wrapper-bg)] rounded-[4px] text-[12px] px-2 py-1 min-w-[60px] text-center block text-gray-600 font-medium">
      {symbol}
    </span>
  );
};

export default SymbolPill;
