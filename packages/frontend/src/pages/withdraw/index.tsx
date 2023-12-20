import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useAccount, useBalance } from 'wagmi';
import { Spinner, Alert } from '@material-tailwind/react';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
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
      <WithdrawForm />
    </WithdrawWrapper>
  );
};

export default Withdraw;
