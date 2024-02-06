import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { twJoin } from 'tailwind-merge';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { CustomConnectButton } from '@rio-monorepo/ui/components/Nav/CustomConnectButton';
import { useEffect, useMemo, useState } from 'react';
import { OperatorCard } from '@/components/Operators/OperatorCard';
import { IconPackageX } from '@rio-monorepo/ui/components/Icons/IconPackageX';
import { asType, isEqualAddress } from '@rio-monorepo/ui/lib/utilities';
import {
  OperatorDelegator,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { OperatorDetails, type LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { Address, ContractFunctionConfig, zeroAddress } from 'viem';
import { useContractReads } from 'wagmi';
import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';

export function OperatorDetails({
  restakingToken,
  operatorDelegators,
  refetchOperators
}: {
  restakingToken?: LRTDetails;
  operatorDelegators?: OperatorDelegator[];
  refetchOperators: () => void;
}) {
  if (restakingToken) {
    return (
      <OperatorDetailsWithLRTWrapper
        restakingToken={restakingToken}
        operatorDelegators={operatorDelegators}
        refetchOperators={refetchOperators}
      />
    );
  }
  return (
    <OperatorDetailsBase
      operatorDelegators={operatorDelegators}
      refetchOperators={refetchOperators}
    />
  );
}

function OperatorDetailsWithLRTWrapper({
  operatorDelegators,
  restakingToken,
  refetchOperators
}: {
  operatorDelegators?: OperatorDelegator[];
  restakingToken: LRTDetails;
  refetchOperators: () => void;
}) {
  const lrt = useLiquidRestakingToken(restakingToken.address);
  const [operatorRegistryAddress, setOperatorRegistryAddress] = useState<
    Address | undefined
  >(lrt?.token?.deployment?.operatorRegistry as Address | undefined);

  useEffect(
    function setRegistryAddressBecauseLRTDoesNotTriggerRerender() {
      if (operatorRegistryAddress || !lrt) return;
      const timeout = setInterval(
        () =>
          setOperatorRegistryAddress(
            asType<Address>(lrt?.token?.deployment?.operatorRegistry)
          ),
        1000
      );
      return () => clearInterval(timeout);
    },
    [lrt, operatorRegistryAddress]
  );

  const { data: onchainDetailsRaw } = useContractReads({
    contracts: operatorDelegators?.map(
      (operatorDelegator) =>
        ({
          address: operatorRegistryAddress ?? zeroAddress,
          abi: RioLRTOperatorRegistryABI,
          functionName: 'getOperatorDetails',
          args: [operatorDelegator.delegatorId]
        }) as ContractFunctionConfig<
          typeof RioLRTOperatorRegistryABI,
          'getOperatorDetails'
        >
    ),
    enabled: !!operatorRegistryAddress && !!operatorDelegators?.length,
    staleTime: 1000 * 60 * 5
  });

  const onchainDetails = useMemo(() => {
    if (!onchainDetailsRaw) return undefined;
    return onchainDetailsRaw.map((details) => {
      if (details.error) return undefined;
      return details.result;
    });
  }, [onchainDetailsRaw]);

  return (
    <OperatorDetailsBase
      operatorDelegators={operatorDelegators}
      restakingToken={restakingToken}
      refetchOperators={refetchOperators}
      onchainDetails={onchainDetails}
      operatorRegistryAddress={operatorRegistryAddress}
    />
  );
}

type SortedDelegators = {
  subgraph: OperatorDelegator[];
  onchain: (OperatorDetails | undefined)[];
};

function OperatorDetailsBase({
  restakingToken,
  operatorDelegators,
  onchainDetails,
  refetchOperators,
  operatorRegistryAddress
}: {
  operatorRegistryAddress?: Address;
  restakingToken?: LRTDetails;
  operatorDelegators?: OperatorDelegator[];
  onchainDetails?: (OperatorDetails | undefined)[];
  refetchOperators: () => void;
}) {
  const { address } = useAccountIfMounted();

  const { managedDelegators, allDelegators } = useMemo(() => {
    const managedDelegators: SortedDelegators = { subgraph: [], onchain: [] };
    const allDelegators: SortedDelegators = { subgraph: [], onchain: [] };

    if (!operatorDelegators) {
      return { managedDelegators, allDelegators };
    }
    if (!address) {
      return {
        managedDelegators,
        allDelegators: {
          subgraph: operatorDelegators ?? [],
          onchain: onchainDetails ?? []
        }
      };
    }

    operatorDelegators.forEach((operatorDelegator, i) => {
      const onchainDetail = onchainDetails?.[i];
      if (
        isEqualAddress(operatorDelegator.address, address) ||
        isEqualAddress(operatorDelegator.operator.address, address) ||
        isEqualAddress(operatorDelegator.manager, address) ||
        isEqualAddress(operatorDelegator.earningsReceiver, address) ||
        (onchainDetail && isEqualAddress(onchainDetail.pendingManager, address))
      ) {
        managedDelegators.subgraph.push(operatorDelegator);
        managedDelegators.onchain.push(onchainDetail);
      } else {
        allDelegators.subgraph.push(operatorDelegator);
        allDelegators.onchain.push(onchainDetail);
      }
    });

    return { managedDelegators, allDelegators };
  }, [operatorDelegators, onchainDetails, address]);

  return (
    <>
      <FormCard.Wrapper title="Operators" header="Manage details">
        {managedDelegators.subgraph.map((operatorDelegator, i) => (
          <OperatorCard
            key={i}
            refetchOperator={refetchOperators}
            operatorDelegator={operatorDelegator}
            restakingToken={restakingToken}
            onchainDetail={managedDelegators.onchain[i]}
            operatorRegistryAddress={operatorRegistryAddress}
            editable={
              !!address && isEqualAddress(operatorDelegator.manager, address)
            }
          />
        ))}
        {!managedDelegators?.subgraph.length && (
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
                !!operatorDelegators?.length && (
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
        {allDelegators?.subgraph?.map((operatorDelegator, i) => (
          <OperatorCard
            key={i}
            refetchOperator={refetchOperators}
            operatorDelegator={operatorDelegator}
            onchainDetail={allDelegators.onchain[i]}
            restakingToken={restakingToken}
            operatorRegistryAddress={operatorRegistryAddress}
          />
        ))}
      </FormCard.Wrapper>
    </>
  );
}
