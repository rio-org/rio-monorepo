import type { NextPage } from 'next';
import RestakeForm from '@/components/OperatorKeys/RestakeForm';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { useEffect, useState } from 'react';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import OperatorKeysWrapper from '../components/OperatorKeys/OperatorKeysWrapper';

const Home: NextPage = () => {
  // When more LRT products are available, we'll offer a way to switch these
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );

  useEffect(() => {
    if (!lrtList?.length || activeLrt) return;
    setActiveLrt(lrtList[0]);
  }, [lrtList]);

  return (
    <OperatorKeysWrapper>
      {activeLrt && <RestakeForm lrt={activeLrt} />}
    </OperatorKeysWrapper>
  );
};

export default Home;
