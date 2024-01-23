import type { NextPage } from 'next';
import OperatorKeysWrapper from '../components/OperatorKeys/OperatorKeysWrapper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidatorKeyItem } from '@rio-monorepo/ui/lib/typings';
import { validateOperatorKeys } from '@rio-monorepo/ui/lib/validation';

import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';

import {
  useAccount,
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction
} from 'wagmi';
import { Hex } from 'viem';
import { RioLRTOperatorRegistryABI } from '@rio-monorepo/ui/abi/RioLRTOperatorRegistryABI';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import Skeleton from 'react-loading-skeleton';
import { useGetLatestAssetPrice } from '@rio-monorepo/ui/hooks/useGetLatestAssetPrice';
import { NATIVE_ETH_ADDRESS } from '@rio-monorepo/ui/config';
import SubmitterField from '@/components/OperatorKeys/SubmitterField';
import SubmitterButton from '@/components/OperatorKeys/SubmitterButton';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';

const defaultFunctionArgs = [255, 0n, '0x', '0x'] as const;

const OperatorKeysPage: NextPage = () => {
  const client = usePublicClient();
  const account = useAccount();
  const isMounted = useIsMounted();
  const address = isMounted ? account?.address : undefined;

  const { data: operators, isFetched } = useGetOperators(
    { where: { manager: address?.toLowerCase() } },
    { enabled: !!address }
  );

  const { data: ethAssetPrice } = useGetLatestAssetPrice({
    tokenAddress: NATIVE_ETH_ADDRESS
  });

  const [value, setValue] = useState<string | undefined>();
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
      return defaultFunctionArgs;
    }
  }, [operators?.[0]?.operatorId, value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleValidation = useCallback(
    (json: string) => validateOperatorKeys({ json }),
    []
  );

  const contractWriteOptions = {
    address: '0xaEc50d7Dfa361C940A394e10c085c5133b3793A0',
    abi: RioLRTOperatorRegistryABI,
    functionName: 'addValidatorDetails',
    args,
    enabled: !!address && args !== defaultFunctionArgs
  } as const;

  const {
    data: feeData,
    isLoading: isFeeDataLoading,
    isFetching: isFeeDataFetching,
    error: feeDataError
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

  const {
    isSuccess: isTxSuccess,
    isLoading: isTxLoading,
    error: txError
  } = useWaitForTransaction({
    hash: data?.hash
  });

  useEffect(() => {
    if (!address) return;
    client
      ?.estimateContractGas({ account: address, ...contractWriteOptions })
      .then(setGas)
      .catch(console.error);
  }, [address, client, contractWriteOptions]);

  const error = prepareError ?? writeError ?? txError ?? feeDataError;
  const isLoading = isWriteLoading || isTxLoading;
  const inputDisabled =
    !address || (isFetched && !operators?.length) || isTxLoading;
  const submitDisabled =
    inputDisabled || isLoading || isPrepareLoading || !!error;
  const gasPriceEth =
    isFeeDataLoading || isFeeDataFetching
      ? undefined
      : +(feeData?.formatted.gasPrice || 0) * Number(gas || 0);
  const gasPriceUsd =
    !ethAssetPrice?.latestUSDPrice || typeof gasPriceEth === 'undefined'
      ? undefined
      : gasPriceEth * ethAssetPrice.latestUSDPrice;

  const resetForm = () => {
    setValue('');
    resetWrite();
  };

  // remove reeth conversion from operator
  // remove reeth conversion from operator
  // remove reeth conversion from operator
  // remove reeth conversion from operator
  // remove reeth conversion from operator
  // remove reeth conversion from operator
  // remove reeth conversion from operator
  // remove reeth conversion from operator
  // remove reeth conversion from operator

  return (
    <OperatorKeysWrapper>
      <SubmitterField
        validation={handleValidation}
        onChange={handleChange}
        disabled={inputDisabled}
        readOnly={inputDisabled}
        autoFocus={!!address}
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
          {typeof gasPriceEth === 'undefined' ||
          typeof gasPriceUsd === 'undefined' ? (
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
      <SubmitterButton
        operatorId={args[0]}
        txError={error}
        disabled={submitDisabled}
        isValid={!!write}
        isEmpty={!value}
        isTxLoading={isLoading}
        isTxError={!!txError}
        isTxSuccess={isTxSuccess}
        txHash={data?.hash}
        setIsTxSuccess={resetForm}
        setisTxError={resetForm}
        handleExecute={() => write?.()}
      />
    </OperatorKeysWrapper>
  );
};

export default OperatorKeysPage;
