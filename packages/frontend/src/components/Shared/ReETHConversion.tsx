import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import iconTransaction from '../../assets/icon-transaction.svg';
import { motion } from 'framer-motion';
import cx from 'classnames';
import { useAssetPriceUsd } from '../../hooks/useAssetPriceUsd';
import { LRTDetails } from '../../lib/typings';
import { useGetLiquidRestakingTokens } from '../../hooks/useGetLiquidRestakingTokens';

const styledAmount = (amount: number) => {
  const main = amount.toFixed();
  const decimal = amount.toFixed(2).split('.')[1];
  return (
    <>
      ${main}
      <span className="text-[var(--color-black-25)]">.{decimal}</span>
    </>
  );
};

type Props = {
  padded?: boolean;
};
const ReETHConversion = ({ padded }: Props) => {
  const reEth = <>1 reETH</>;
  const [isReEth, setIsReEth] = useState<boolean>(true);
  const [reEthInUSD, setReEthInUSD] = useState<number>(0);
  const [reEthToken, setReEthToken] = useState<LRTDetails | undefined>();
  const assetPriceUsd = useAssetPriceUsd(reEthToken?.address);

  const { data: lrts, error } = useGetLiquidRestakingTokens();

  useEffect(() => {
    if (error || !lrts) return;
    setReEthToken(lrts.find((lrt) => lrt.symbol === 'reETH'));
  }, [lrts]);

  useEffect(() => {
    setReEthInUSD(assetPriceUsd);
  }, [assetPriceUsd]);

  const handleChange = () => {
    setIsReEth((prev) => !prev);
  };

  return (
    <button
      className={cx(
        'group px-4 py-2 flex flex-row justify-center items-center gap-2 border border-[var(--color-element-wrapper-bg-light)] hover:border-[var(--color-element-wrapper-bg-light-hover)] rounded-full bg-transparent text-black text-[10px] hover:bg-[var(--color-element-wrapper-bg-hover)] hover:text-black',
        padded && 'py-3'
      )}
      onClick={() => handleChange()}
    >
      <span className="text-[var(--color-black-50)] group-hover:text-black">
        {isReEth ? (
          <>
            {styledAmount(reEthInUSD)} = {reEth}
          </>
        ) : (
          <>
            {reEth} = {styledAmount(reEthInUSD)}
          </>
        )}
      </span>
      <motion.div
        animate={{ rotate: isReEth ? 180 : -180 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={iconTransaction}
          width={12}
          height={12}
          alt=""
          className="opacity-25 group-hover:opacity-50 transition-opacity"
        />
      </motion.div>
    </button>
  );
};

export default ReETHConversion;
