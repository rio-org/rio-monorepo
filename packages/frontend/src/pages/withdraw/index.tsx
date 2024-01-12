import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawForm from '../../components/Withdraw/WithdrawForm';
import { CHAIN_ID } from '../../../config';
import { LRTDetails } from '../../lib/typings';
import { useGetLiquidRestakingTokens } from '../../hooks/useGetLiquidRestakingTokens';

type Props = {
  lrtList: LRTDetails[];
};

const Withdraw: NextPage<Props> = ({ lrtList }) => {
  return (
    <WithdrawWrapper>
      <WithdrawForm lrtList={lrtList} />
    </WithdrawWrapper>
  );
};

export default Withdraw;

export async function getStaticProps() {
  const chainId = CHAIN_ID;
  const lrtList = await useGetLiquidRestakingTokens(chainId);
  return {
    props: {
      lrtList
    }
  };
}
