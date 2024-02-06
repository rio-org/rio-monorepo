import type { NextPage } from 'next';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { twJoin } from 'tailwind-merge';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { CustomConnectButton } from '@rio-monorepo/ui/components/Nav/CustomConnectButton';
import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';
import { useMemo } from 'react';
import { OperatorCard } from '@/components/Operators/OperatorCard';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { IconPackageX } from '@rio-monorepo/ui/components/Icons/IconPackageX';
import { isEqualAddress } from '@rio-monorepo/ui/lib/utilities';
import { Operator } from '@rionetwork/sdk-react';

const OperatorsPage: NextPage = () => {
  const { address } = useAccountIfMounted();
  const { data: operatorsUnsorted, isLoading, refetch } = useGetOperators();
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

  // const operators = [..._operators];
  // if (operators[0] && address) operators[0].manager = address;

  const [userManagedOperators, allOperators] = useMemo(() => {
    return operators?.reduce<[Operator[], Operator[]]>(
      ([managed, rest], next) => {
        if (!address) return [managed, [...rest, next]];
        if (
          isEqualAddress(next.manager, address) ||
          isEqualAddress(next.earningsReceiver, address)
        ) {
          return [[...managed, next], rest];
        }
        return [managed, [...rest, next]];
      },
      [[], []]
    );
  }, [operators, address]);

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-start">
      <FormCard.Wrapper title="Operators" header="Manage details">
        {address &&
          userManagedOperators?.map((operator, i) => (
            <OperatorCard
              key={i}
              refetchOperator={refetch}
              operator={operator}
              restakingToken={activeLrt}
              editable={isEqualAddress(operator.manager, address)}
            />
          ))}
        {!userManagedOperators?.length && (
          <FormCard.Body>
            <div
              className={twJoin(
                'flex flex-col justify-center items-center',
                'w-full min-h-[160px] p-4',
                'text-center text-black',
                'rounded-xl bg-black bg-opacity-5'
              )}
            >
              {!address ? (
                <>
                  <p className="opacity-50 mb-6">
                    Connect your wallet to edit your operator details
                  </p>
                  <div>{!address && <CustomConnectButton />}</div>
                </>
              ) : (
                !isLoading && (
                  <>
                    <IconPackageX className="[&>path]:stroke-[#CC4C56]" />
                    <p className="opacity-50 mt-4">
                      Your current wallet does not manage any operators.
                    </p>
                  </>
                )
              )}
            </div>
          </FormCard.Body>
        )}
      </FormCard.Wrapper>
      <FormCard.Wrapper header="All operators" className="mb-8">
        {allOperators?.map((operator, i) => (
          <OperatorCard
            key={i}
            refetchOperator={refetch}
            operator={operator}
            restakingToken={activeLrt}
          />
        ))}
      </FormCard.Wrapper>
    </div>
  );
};

export default OperatorsPage;
