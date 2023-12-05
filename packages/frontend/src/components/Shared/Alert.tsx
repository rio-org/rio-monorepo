import { motion } from 'framer-motion';
import React from 'react';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';
import IconExternal from '../Icons/IconExternal';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import cx from 'classnames';
import { CHAIN_ID } from '../../../config';
import { Hash } from 'viem';

type Props = {
  isSuccess: boolean;
  isError: boolean;
  // transactionHash: Hash | null;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (isError: boolean) => void;
};

const Alert = ({ isSuccess, isError, setIsSuccess, setIsError }: Props) => {
  return (
    <>
      {isSuccess && (
        <motion.div
          className="p-4 text-center flex flex-col gap-0 justify-center items-center text-[14px] rounded-lg w-full bg-[var(--color-green-bg)] text-[var(--color-green)]"
          variants={TX_BUTTON_VARIANTS}
          onClick={() => setIsSuccess(false)}
          key={'success'}
        >
          <span className="font-medium">Success</span>
        </motion.div>
      )}
      {isError && (
        <motion.button
          className="p-4 text-center text-[14px] rounded-lg w-full bg-[var(--color-yellow-bg)] text-[var(--color-yellow)] hover:bg-[var(--color-yellow-bg-hover)]"
          variants={TX_BUTTON_VARIANTS}
          onClick={() => setIsError(false)}
          key={'error'}
        >
          <span className="font-medium block">Error. Please try again.</span>
        </motion.button>
      )}
    </>
  );
};

export default Alert;
