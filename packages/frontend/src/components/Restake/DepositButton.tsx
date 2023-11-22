import React, { useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '../Shared/Alert';
import { Spinner } from '@material-tailwind/react';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import { useAccount } from 'wagmi';

type Props = {
  isValidAmount: boolean;
  isEmpty: boolean;
};

const DepositButton = ({ isValidAmount, isEmpty }: Props) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { address } = useAccount();

  const fetchDummyData = async () => {
    setIsLoading(true);
    //  wait 1 second before setting isError to true
    await new Promise((resolve) => setTimeout(resolve, 1000)).catch((err) => {
      console.log(err);
    });
    setIsLoading(false);

    // randomly set isSuccess to true or false
    const random = Math.random();
    if (random > 0.5) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  return (
    <AnimatePresence>
      {!isSuccess && !isError && (
        <motion.button
          className={cx(
            'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValidAmount && 'bg-opacity-20',
            isValidAmount && !isLoading && 'hover:bg-[var(--color-dark-gray)]'
          )}
          disabled={!isValidAmount || isLoading}
          onClick={() => {
            fetchDummyData().catch(() => {
              setIsError(true);
            });
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'restake'}
        >
          {!address && (
            <span className="opacity-20 text-black">Connect to claim</span>
          )}
          {address && !isLoading && !isError && (
            <span className={cx(!isValidAmount && 'opacity-20 text-black')}>
              {isValidAmount && 'Restake'}
              {isEmpty && 'Enter an amount'}
              {!isValidAmount && !isEmpty && 'Invalid amount'}
            </span>
          )}
          {address && isLoading && (
            <div className="w-full text-center flex items-center justify-center gap-2">
              <Spinner width={16} />
              <span className="opacity-40">Restaking</span>
            </div>
          )}
        </motion.button>
      )}
      <div className="mt-4">
        <Alert
          isSuccess={isSuccess}
          isError={isError}
          setIsSuccess={setIsSuccess}
          setIsError={setIsError}
        />
      </div>
    </AnimatePresence>
  );
};

export default DepositButton;
