import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';
import IconExternal from '../Icons/IconExternal';
import { CHAIN_ID } from '../../../config';

type Props = {
  isSuccess: boolean;
  isError: boolean;
  txHash?: `0x${string}`;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (isError: boolean) => void;
};

const Alert = ({
  isSuccess,
  isError,
  txHash,
  setIsSuccess,
  setIsError
}: Props) => {
  return (
    <>
      {isSuccess && (
        <motion.div
          className="p-4 text-center flex flex-col gap-0 justify-center items-center text-[14px] rounded-lg w-full bg-[var(--color-green-bg)] text-[var(--color-green)]"
          variants={TX_BUTTON_VARIANTS}
          onClick={() => setIsSuccess(false)}
        >
          <span className="font-medium">Success</span>
        </motion.div>
      )}
      {isError && (
        <motion.button
          className="p-4 text-center text-[14px] rounded-lg w-full bg-[var(--color-yellow-bg)] text-[var(--color-yellow)] hover:bg-[var(--color-yellow-bg-hover)]"
          variants={TX_BUTTON_VARIANTS}
          onClick={() => setIsError(false)}
        >
          <span className="font-medium block">Error. Please try again.</span>
        </motion.button>
      )}
      <AnimatePresence>
        {isSuccess && txHash && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

export default Alert;
