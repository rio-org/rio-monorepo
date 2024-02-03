import type { NextPage } from 'next';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { twJoin } from 'tailwind-merge';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { CustomConnectButton } from '@rio-monorepo/ui/components/Nav/CustomConnectButton';
import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';
import { useMemo } from 'react';
import { OperatorCard } from '@/components/Operators/OperatorCard';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';

const OperatorsPage: NextPage = () => {
  const { address } = useAccountIfMounted();
  const { data: operatorsUnsorted } = useGetOperators();
  const { data: lrts } = useGetLiquidRestakingTokens();
  const activeLrt = useMemo(
    () => lrts?.find((lrt) => lrt?.symbol === 'reETH'),
    [lrts]
  );

  /*
  There's currently an issue with the configuration of the useGetOperators hook
  that's causing typescript errors relating to orderDirection and orderBy.

  this works:
    useAccountIfMounted({
      orderBy: 'metadata__name',
      orderDirection: 'asc'
    })

  but eslint screams because the enums aren't used ¯\_(ツ)_/¯

  I'm not trying to use `@ts-ignore`... so I'll just sort it here (for now)
  */
  const operators = useMemo(() => {
    if (!operatorsUnsorted) return [];
    return operatorsUnsorted.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name);
    });
  }, [operatorsUnsorted]);

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-start">
      <FormCard.Container title="Operators" header="Manage details">
        <div
          className={twJoin(
            'flex flex-col justify-center items-center gap-6',
            'w-full min-h-[160px] p-4',
            'text-center text-black',
            'rounded-xl bg-black bg-opacity-5'
          )}
        >
          <p className="opacity-50">
            Connect your wallet to edit your operator details
          </p>
          <div>{!address && <CustomConnectButton />}</div>
        </div>
      </FormCard.Container>
      <FormCard.Wrapper header="All operators" className="mb-8">
        {operators?.map((operator, i) => (
          <OperatorCard
            key={i}
            operator={operator}
            restakingToken={activeLrt}
          />
        ))}
      </FormCard.Wrapper>
    </div>
  );
};

export default OperatorsPage;
