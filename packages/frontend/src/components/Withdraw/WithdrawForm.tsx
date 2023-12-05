import { Alert, Spinner } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { AssetDetails, TokenSymbol } from '../../lib/typings';
import WithdrawAssetSelector from './WithdrawAssetSelector';
import WithdrawButton from './WithdrawButton';
import WithdrawField from './WithdrawField';
import WithdrawItemized from './WithdrawItemized';
// import { useLiquidRestakingToken } from '@rionetwork/sdk-react';
// import { ASSET_ADDRESS } from '../../lib/constants';

const WithdrawForm = ({ assetsList }: { assetsList: AssetDetails[] }) => {
  const [activeTokenSymbol, setActiveTokenSymbol] =
    useState<TokenSymbol>('＊ETH');
  const [accountTokenBalance, setAccountTokenBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address
    // TODO: use reETH address. currently using ETH address for testing
  });
  // const rethAddress = ASSET_ADDRESS['reETH'] as string;
  // const restakingToken = useLiquidRestakingToken(rethAddress);
  // console.log(
  //   'restakingToken?.allowanceTarget',
  //   restakingToken?.allowanceTarget
  // );
  const isValidAmount = amount > 0 && amount <= accountTokenBalance;
  const clearForm = () => {
    setAmount(0);
    setActiveTokenSymbol('＊ETH');
  };
  useEffect(() => {
    if (data) {
      setAccountTokenBalance(+data?.formatted);
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
    <>
      <WithdrawField
        amount={amount}
        accountTokenBalance={accountTokenBalance}
        activeTokenSymbol={activeTokenSymbol}
        setAmount={setAmount}
      />
      <WithdrawAssetSelector
        assetsList={assetsList}
        activeTokenSymbol={activeTokenSymbol}
        setActiveTokenSymbol={setActiveTokenSymbol}
      />
      <WithdrawItemized amount={amount} activeTokenSymbol={activeTokenSymbol} />
      <WithdrawButton isValid={isValidAmount} clearForm={clearForm} />
    </>
  );
};

export default WithdrawForm;
