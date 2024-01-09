import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawForm from '../../components/Withdraw/WithdrawForm';
import { useGetAssetsList } from '../../hooks/useGetAssetsList';
import { CHAIN_ID } from '../../../config';
import { AssetDetails } from '../../lib/typings';

type Props = {
  assetsList: AssetDetails[];
};

const Withdraw: NextPage<Props> = ({ assetsList }) => {
  return (
    <WithdrawWrapper>
      <WithdrawForm assets={assetsList} />
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
