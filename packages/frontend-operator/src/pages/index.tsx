import { useMemo } from 'react';
import type { NextPage } from 'next';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import OperatorKeysWrapper from '@/components/OperatorKeys/OperatorKeysWrapper';
import { OperatorKeysForm } from '@/components/OperatorKeys/OperatorKeysForm';

const OperatorKeysPage: NextPage = () => {
  const { data: lrts } = useGetLiquidRestakingTokens();
  const activeLrt = useMemo(
    () => lrts?.find((lrt) => lrt?.symbol === 'reETH'),
    [lrts]
  );

  return (
    <OperatorKeysWrapper>
      <OperatorKeysForm lrt={activeLrt} />{' '}
    </OperatorKeysWrapper>
  );
};

export default OperatorKeysPage;
