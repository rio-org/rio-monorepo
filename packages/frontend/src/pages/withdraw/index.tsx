import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useAccount, useBalance } from 'wagmi';
import { Spinner, Alert } from '@material-tailwind/react';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawTabs from '../../components/Withdraw/WithdrawTabs';
import WithdrawForm from '../../components/Withdraw/WithdrawForm';

const Withdraw: NextPage = () => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address
    // TODO: use reETH address. currently using ETH address for testing
  });

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  if (isError) return <Alert color="red">Error loading account balance.</Alert>;
  if (isLoading)
    return (
      <div className="w-full text-center min-h-[100px] flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <WithdrawWrapper>
      <div>
        <h1 className="text-2xl mb-2 font-medium">Withdraw</h1>
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-[2px]">
          <div className="flex justify-between gap-8 w-full px-5 pt-5 pb-3">
            <div className="flex gap-2 justify-center items-center">
              <WithdrawTabs />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 w-full m-[2px] flex flex-col gap-4">
            <WithdrawForm />
          </div>
        </div>
      </div>
    </WithdrawWrapper>
  );
};

export default Withdraw;
