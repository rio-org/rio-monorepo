import React, { ReactNode, useState } from 'react';
import { reEthInUSD } from '../../../placeholder';
import Image from 'next/image';
import iconTransaction from '../../assets/icon-transaction.svg';
import { motion } from 'framer-motion';
import cx from 'classnames';

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
  const [first, setFirst] = useState<ReactNode>(reEth);
  const [second, setSecond] = useState<ReactNode>(styledAmount(reEthInUSD));

  const handleChange = () => {
    if (isReEth) {
      setFirst(styledAmount(reEthInUSD));
      setSecond(reEth);
      setIsReEth(false);
    } else {
      setFirst(reEth);
      setSecond(styledAmount(reEthInUSD));
      setIsReEth(true);
    }
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
        {first} = {second}
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
