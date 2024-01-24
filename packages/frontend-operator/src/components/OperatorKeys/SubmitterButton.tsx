import React, { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '@rio-monorepo/ui/components/Shared/Alert';
import { TX_BUTTON_VARIANTS } from '@rio-monorepo/ui/lib/constants';
import { Spinner } from '@material-tailwind/react';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import {
  cn,
  getChainName,
  linkToTxOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { ContractError } from '@rio-monorepo/ui/lib/typings';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';
import { twJoin } from 'tailwind-merge';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';

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
  error?: ContractError | null;
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
  error,
  setIsTxSuccess,
  setisTxError,
  handleExecute
}: Props) => {
  const { address } = useAccountIfMounted();
  const isMounted = useIsMounted();
  const { openConnectModal } = useConnectModal();

  const { chain } = useNetwork();
  const {
    error: switchNetworkError,
    isLoading: isSwitchNetworkLoading,
    switchNetwork
  } = useSwitchNetwork();
  const wrongNetwork = chain?.id && chain?.id !== CHAIN_ID;

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

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {(isTxError || isTxSuccess || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="mt-4">
              <Alert
                errorMessage={
                  txError?.shortMessage ??
                  txError?.message ??
                  error?.shortMessage ??
                  error?.message
                }
                isSuccess={isTxSuccess}
                isError={isTxError}
                setIsSuccess={setIsTxSuccess}
                setIsError={setisTxError}
              />
            </div>
          </motion.div>
        )}

        {!(isTxError || isTxSuccess || error) && (
          <motion.button
            className={cn(
              'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
              !isDisabled
                ? 'hover:bg-[var(--color-dark-gray)]'
                : 'bg-opacity-20'
            )}
            disabled={isDisabled}
            onClick={() => {
              !address
                ? openConnectModal?.()
                : wrongNetwork
                ? switchNetwork?.(CHAIN_ID)
                : handleExecute();
            }}
            variants={TX_BUTTON_VARIANTS}
          >
            {(() => {
              if (isTxLoading || (wrongNetwork && isSwitchNetworkLoading)) {
                return (
                  <div className="w-full text-center flex items-center justify-center gap-2">
                    <Spinner width={16} />
                    <span className="text-black opacity-40">
                      Awaiting confirmation
                    </span>
                  </div>
                );
              }

              return (
                <span className={cn(isDisabled && 'opacity-20 text-black')}>
                  {!address && wrongNetwork
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
                className={twJoin(
                  'flex flex-row justify-center items-center gap-2',
                  'w-full h-fit',
                  'px-[8px] py-[2px] rounded-full',
                  'text-center text-gray-500 text-sm font-normal leading-none whitespace-nowrap',
                  'transition-colors duration-200 '
                )}
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
