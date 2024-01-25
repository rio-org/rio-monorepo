import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { NATIVE_ETH_ADDRESS } from '@rio-monorepo/ui/config';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useGetLatestAssetPrice } from '@rio-monorepo/ui/hooks/useGetLatestAssetPrice';
import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';
import {
  type ContractError,
  type LRTDetails,
  type ValidatorKeyItem,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';
import { validateOperatorKeys } from '@rio-monorepo/ui/lib/validation';
import {
  LiquidRestakingTokenClient,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Address, Hex, zeroAddress } from 'viem';
import {
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction
} from 'wagmi';
import SubmitterField from './SubmitterField';

const DEFAULT_ARGS = [255, 0n, '0x', '0x'] as const;

interface OperatorKeysFormProps {
  lrt?: LRTDetails;
}

export function OperatorKeysForm({ lrt }: OperatorKeysFormProps) {
  return lrt ? (
    <OperatorKeysFormWithLRT lrt={lrt} />
  ) : (
    <OperatorKeysFormWithoutLRT />
  );
}

function OperatorKeysFormWithLRT({ lrt }: { lrt: LRTDetails }) {
  const lrtClient = useLiquidRestakingToken(lrt.address);
  return <OperatorKeysFormInternal lrtClient={lrtClient} />;
}

function OperatorKeysFormWithoutLRT() {
  return <OperatorKeysFormInternal />;
}

function OperatorKeysFormInternal({
  lrtClient
}: {
  lrtClient?: LiquidRestakingTokenClient | null;
}) {
  const client = usePublicClient();
  const { address } = useAccountIfMounted();

  const { data: operators, isFetched } = useGetOperators(
    { where: { manager: address?.toLowerCase() } },
    { enabled: !!address }
  );

  const { data: ethAssetPrice } = useGetLatestAssetPrice({
    tokenAddress: NATIVE_ETH_ADDRESS
  });

  const [error, setError] = useState<ContractError | undefined>();
  const [value, setValue] = useState<string | undefined>();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [gas, setGas] = useState<bigint>();

  const args = useMemo(() => {
    const _args = [operators?.[0]?.operatorId, 0n, '0x', '0x'] as [
      number,
      bigint,
      Hex,
      Hex
    ];

    try {
      if (!value) throw new Error('Invalid value');
      if (typeof _args[0] === 'undefined') throw new Error('Invalid operator');

      const parsed = JSON.parse(value) as ValidatorKeyItem[];
      if (!Array.isArray(parsed)) {
        throw new Error('Input value must be a JSON array');
      }

      parsed.forEach((key) => {
        _args[1] += 1n;
        _args[2] += key.pubkey;
        _args[3] += key.signature;
      });

      return _args;
    } catch (e) {
      return DEFAULT_ARGS;
    }
  }, [operators?.[0]?.operatorId, value]);

  const operatorAddress =
    (lrtClient?.token?.deployment?.operatorRegistry as Address | undefined) ||
    zeroAddress;

  const contractWriteOptions = useMemo(
    () =>
      ({
        address: operatorAddress,
        abi: RioLRTOperatorRegistryABI,
        functionName: 'addValidatorDetails',
        args,
        enabled:
          !!address &&
          isValid &&
          args !== DEFAULT_ARGS &&
          !!lrtClient?.token?.deployment?.operatorRegistry
      }) as const,
    [address, isValid, args, operatorAddress]
  );

  const {
    data: feeData,
    isLoading: isFeeDataLoading,
    isFetching: isFeeDataFetching
  } = useFeeData(contractWriteOptions);

  const {
    config,
    isLoading: isPrepareLoading,
    error: prepareError
  } = usePrepareContractWrite(contractWriteOptions);

  const {
    data,
    write,
    isLoading: isWriteLoading,
    error: writeError,
    reset: resetWrite
  } = useContractWrite(config);

  const { error: txError } = useWaitForTransaction({
    hash: data?.hash
  });

  useEffect(() => {
    if (!address || contractWriteOptions.args === DEFAULT_ARGS) {
      return setGas(0n);
    }

    client
      ?.estimateContractGas({ account: address, ...contractWriteOptions })
      .then(setGas)
      .catch(console.error);
  }, [address, client, contractWriteOptions]);

  useEffect(() => {
    setError(prepareError ?? writeError ?? txError ?? undefined);
  }, [prepareError, writeError, txError]);

  const isNotOperator = !!address && isFetched && !operators?.length;
  const gasPriceEth =
    isFeeDataLoading || isFeeDataFetching
      ? undefined
      : +(feeData?.formatted.gasPrice || 0) * Number(gas || 0);
  const gasPriceUsd =
    !ethAssetPrice?.latestUSDPrice || typeof gasPriceEth === 'undefined'
      ? undefined
      : gasPriceEth * ethAssetPrice.latestUSDPrice;
  const pricesLoaded =
    typeof gasPriceEth !== 'undefined' && typeof gasPriceUsd !== 'undefined';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleValidation = useCallback((json: string) => {
    try {
      validateOperatorKeys({ json });
      setIsValid(true);
      return true;
    } catch (e) {
      setIsValid(false);
      throw e;
    }
  }, []);

  const clearErrors = useCallback(() => {
    resetWrite();
    setError(undefined);
  }, []);

  const resetForm = useCallback(() => {
    setValue('');
    clearErrors();
  }, []);

  return (
    <>
      <SubmitterField
        validation={handleValidation}
        onChange={handleChange}
        disabled={!address || isNotOperator}
        autoFocus={!!address}
        isOperator={!address || !isFetched ? undefined : !!operators?.length}
        value={
          !address
            ? 'Connect your wallet to submit operator keys'
            : !isFetched
            ? 'Loading operators...'
            : !operators?.length
            ? 'Must be a valid operator to submit keys'
            : value ?? ''
        }
      />
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Total Keys</span>
          <strong>{args[1].toString()}</strong>
        </div>
        <HR />
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Estimated Gas Price</span>
          {!pricesLoaded ? (
            <Skeleton height="0.875rem" width={80} />
          ) : (
            <strong className="text-right space-x-2">
              <span>
                {gasPriceEth.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6
                })}{' '}
                ETH
              </span>
              <span className="opacity-50">
                ($
                {gasPriceUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                )
              </span>
            </strong>
          )}
        </div>
      </div>
      <TransactionButton
        transactionType={RioTransactionType.SUBMIT_KEYS}
        hash={data?.hash}
        disabled={isNotOperator || isWriteLoading || isPrepareLoading}
        isSigning={isWriteLoading}
        error={error}
        reset={resetForm}
        clearErrors={clearErrors}
        write={write}
      >
        {!!address && isFetched && !operators?.length
          ? 'Not a registered operator'
          : !value
          ? 'Enter your keys'
          : !write
          ? 'Keys entered are invalid'
          : null}
      </TransactionButton>
    </>
  );
}
