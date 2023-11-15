import React from 'react';
import WithdrawTabs from './WithdrawTabs';
import cx from 'classnames';

type Props = {
  children: React.ReactNode;
  noPadding?: boolean;
};

const WithdrawWrapper = ({ children, noPadding }: Props) => {
  return (
    <div
      className="min-h-full w-full flex justify-center items-start"
      style={{
        marginTop: '10vh',
        minHeight: 'inherit'
      }}
    >
      <div className="w-full lg:max-w-[588px]">
        <h1 className="text-2xl mb-2 font-medium">Withdraw</h1>
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-[2px]">
          <div className="flex justify-between gap-8 w-full px-5 pt-5 pb-3">
            <div className="flex gap-2 justify-center items-center">
              <WithdrawTabs />
            </div>
          </div>
          <div
            className={cx(
              'bg-white rounded-xl w-full m-[2px] flex flex-col gap-4',
              noPadding ? '' : ' p-6'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawWrapper;
