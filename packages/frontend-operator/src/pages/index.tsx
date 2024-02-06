import type { NextPage } from 'next';
import { useMemo } from 'react';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';
import { OperatorDetails } from '@/components/Operators/OperatorDetails';

const OperatorsPage: NextPage = () => {
  const { data: lrts } = useGetLiquidRestakingTokens();
  const activeLrt = useMemo(
    () => lrts?.find((lrt) => lrt?.symbol === 'reETH'),
    [lrts]
  );

  const { data: operatorsUnsorted, refetch } = useGetOperators({
    where: { restakingToken: activeLrt?.address }
  });

  const operatorDelegators = useMemo(() => {
    if (!operatorsUnsorted) return [];
    return operatorsUnsorted.sort((a, b) => {
      if (!a.operator.name || !b.operator.name) return 0;
      return a.operator.name.localeCompare(b.operator.name);
    });
  }, [operatorsUnsorted]);

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-start">
      <OperatorDetails
        refetchOperators={refetch}
        restakingToken={activeLrt}
        operatorDelegators={operatorDelegators}
      />
    </div>
  );
};

export default OperatorsPage;
