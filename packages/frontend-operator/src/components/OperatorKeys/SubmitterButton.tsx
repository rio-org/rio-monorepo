import React, { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '@rio-monorepo/ui/components/Shared/Alert';
import { TX_BUTTON_VARIANTS } from '@rio-monorepo/ui/lib/constants';
import { Spinner } from '@material-tailwind/react';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import {
  cn,
  getChainName,
  linkToTxOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { ContractError } from '@rio-monorepo/ui/lib/typings';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';

type Props = {
  operatorId?: number;
  isValid: boolean;
  isEmpty: boolean;
  isTxLoading: boolean;
  isTxSuccess: boolean;
  isTxError: boolean;
  txHash?: `0x${string}`;
  disabled?: boolean;
  txError?: ContractError | null;
  setIsTxSuccess: (isSuccess: boolean) => void;
  setisTxError: (isError: boolean) => void;
  handleExecute: () => void;
};

const SubmitterButton = ({
  operatorId,
  isValid,
  isEmpty,
  isTxLoading,
  isTxSuccess,
  txError,
  disabled,
  isTxError,
  txHash,
  setIsTxSuccess,
  setisTxError,
  handleExecute
}: Props) => {
  const account = useAccount();
  const isMounted = useIsMounted();
  const address = isMounted ? account?.address : undefined;

  const { chain } = useNetwork();
  const {
    error: switchNetworkError,
    isLoading: isSwitchNetworkLoading,
    switchNetwork
  } = useSwitchNetwork();
  const wrongNetwork = chain?.id !== CHAIN_ID;

  useEffect(() => {
    if (!switchNetworkError) return;
    console.error('error switching networks:', switchNetworkError);
  }, [switchNetworkError]);

  const buttonText = useMemo(() => {
    if (!address) return 'Connect to submit your keys';
    if (address && !operatorId) return 'Not a registered operator';
    if (isEmpty) return 'Enter your keys';
    if (!isValid) return 'Invalid keys';
    return 'Submit';
  }, [address, operatorId, isTxError, isValid, isEmpty]);

  const isDisabled = wrongNetwork
    ? isSwitchNetworkLoading
    : !isValid || isEmpty || isTxLoading || !address || disabled;

  const buttonClassName = cn(
    'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
    !isDisabled ? 'hover:bg-[var(--color-dark-gray)]' : 'bg-opacity-20'
  );

  const loader = useMemo(
    () => (
      <div className="w-full text-center flex items-center justify-center gap-2">
        <Spinner width={16} />
        <span className="text-black opacity-40">Awaiting confirmation</span>
      </div>
    ),
    []
  );

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {(isTxError || isTxSuccess) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="mt-4">
              <Alert
                errorMessage={txError?.shortMessage ?? txError?.message}
                isSuccess={isTxSuccess}
                isError={isTxError}
                setIsSuccess={setIsTxSuccess}
                setIsError={setisTxError}
              />
            </div>
          </motion.div>
        )}

        {!(isTxError || isTxSuccess) && (
          <motion.button
            className={buttonClassName}
            disabled={isDisabled}
            onClick={() =>
              wrongNetwork ? switchNetwork?.(CHAIN_ID) : handleExecute()
            }
            variants={TX_BUTTON_VARIANTS}
          >
            {(() => {
              if (isTxLoading || (wrongNetwork && isSwitchNetworkLoading)) {
                return loader;
              }

              return (
                <span className={cn(isDisabled && 'opacity-20 text-black')}>
                  {wrongNetwork
                    ? `Switch to ${getChainName(CHAIN_ID)}`
                    : buttonText}
                </span>
              );
            })()}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {txHash && (
          <motion.div
            className="mt-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div>
              <a
                href={txHash ? linkToTxOnBlockExplorer(txHash, CHAIN_ID) : ''}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center text-center px-[8px] py-[2px] text-gray-500 font-normal whitespace-nowrap text-sm items-center rounded-full w-full gap-2 h-fit transition-colors duration-200 leading-none"
              >
                View transaction
                <div className="opacity-50">
                  <IconExternal transactionStatus="None" />
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubmitterButton;
