import { useMemo } from 'react';
import type { NextPage } from 'next';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import OperatorKeysWrapper from '@/components/OperatorKeys/OperatorKeysWrapper';
import { OperatorKeysForm } from '@/components/OperatorKeys/OperatorKeysForm';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { TestnetBanner } from '@rio-monorepo/ui/components/Shared/TestnetBanner';

const OperatorKeysPage: NextPage = () => {
  const { data: lrts } = useGetLiquidRestakingTokens();
  const activeLrt = useMemo(
    () => lrts?.find((lrt) => lrt?.symbol === 'reETH'),
    [lrts]
  );

  return (
    <PageWrapper>
      <TestnetBanner />
      <OperatorKeysWrapper>
        <OperatorKeysForm lrt={activeLrt} />{' '}
      </OperatorKeysWrapper>
    </PageWrapper>
  );
};

export default OperatorKeysPage;
