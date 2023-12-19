import React from 'react';
import WithdrawTabs from './WithdrawTabs';
import cx from 'classnames';
import { motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  noPadding?: boolean;
};

const WithdrawWrapper = ({ children, noPadding }: Props) => {
  return (
    <div
      className="min-h-full w-full flex justify-center items-start"
      style={{
        minHeight: 'inherit'
      }}
    >
      <div className="w-full lg:max-w-[588px]">
        <h1 className="text-2xl mb-2 font-medium hidden lg:block">Withdraw</h1>
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-[2px]">
          <div className="flex flex-col justify-start lg:flex-row lg:justify-between gap-2 lg:gap-8 w-full px-4 lg:px-5 pt-3 lg:pt-5 pb-3">
            <h1 className="text-2xl mb-0 font-medium lg:hidden">Withdraw</h1>
            <div className="flex gap-2 justify-center items-center">
              <WithdrawTabs />
            </div>
          </div>
          <motion.div
            className={cx(
              'bg-white rounded-xl w-full m-[2px] flex flex-col gap-4',
              noPadding ? '' : ' p-4 lg:p-6'
            )}
            // layoutId="page-content-box"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawWrapper;
