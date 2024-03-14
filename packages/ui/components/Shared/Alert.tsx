import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';
import IconExternal from '../Icons/IconExternal';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';

type Props = {
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string | null;
  txHash?: `0x${string}`;
  setIsSuccess?: (isSuccess: boolean) => void;
  setIsError?: (isError: boolean) => void;
};

const Alert = ({
  isSuccess,
  isError,
  errorMessage,
  txHash,
  setIsSuccess,
  setIsError
}: Props) => {
  const { chain } = useAccountIfMounted();
  return (
    <>
      {isSuccess && (
        <motion.button
          className="p-4 text-center flex flex-col gap-0 justify-center items-center text-[14px] rounded-full w-full bg-[var(--color-green-bg)] text-[var(--color-green)]"
          variants={TX_BUTTON_VARIANTS}
          onClick={() => setIsSuccess?.(false)}
        >
          <span className="font-medium">Success</span>
        </motion.button>
      )}
      {(isError || errorMessage) && (
        <motion.button
          className="p-4 text-center text-[14px] rounded-full w-full bg-[var(--color-yellow-bg)] text-[var(--color-yellow)] hover:bg-[var(--color-yellow-bg-hover)]"
          variants={TX_BUTTON_VARIANTS}
          onClick={() => setIsError?.(false)}
        >
          <span className="font-medium block">
            {errorMessage || 'Error. Please try again.'}
          </span>
        </motion.button>
      )}
      <AnimatePresence>
        {txHash && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>
              <a
                href={txHash ? linkToTxOnBlockExplorer(txHash, chain?.id) : ''}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center text-center px-[8px] py-[2px] text-foregroundA6 font-normal whitespace-nowrap text-sm items-center rounded-full w-full gap-2 h-fit transition-colors duration-200 leading-none"
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

export default Alert;
