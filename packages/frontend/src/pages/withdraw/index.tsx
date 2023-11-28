import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useAccount, useBalance } from 'wagmi';
import { Spinner, Alert } from '@material-tailwind/react';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawForm from '../../components/Withdraw/WithdrawForm';
import { useGetAssetsList } from '../../hooks/useGetAssetsList';
import { CHAIN_ID } from '../../../config';
import { AssetDetails } from '../../lib/typings';
import { NULL_ADDRESS } from '../../lib/constants';

type Props = {
  assetsList: AssetDetails[];
};

const Withdraw: NextPage<Props> = ({ assetsList }) => {
  const { address } = useAccount();
  const reEthAddress =
    assetsList.find((asset) => asset.symbol === 'reETH')?.address ||
    NULL_ADDRESS;
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: reEthAddress,
    enabled: !!reEthAddress,
    chainId: CHAIN_ID
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
      <WithdrawForm assetsList={assetsList} />
    </WithdrawWrapper>
  );
};

export default Withdraw;

export async function getStaticProps() {
  const chainId = CHAIN_ID;
  const assetsList = await useGetAssetsList(chainId);

  return {
    props: {
      assetsList
    }
  };
}
