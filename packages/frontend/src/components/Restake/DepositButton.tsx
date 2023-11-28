import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '../Shared/Alert';
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
  const [buttonText, setButtonText] = useState('Enter an amount');
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

  useEffect(() => {
    if (isValidAmount) {
      setButtonText('Restake');
    }
    if (isEmpty) {
      setButtonText('Enter an amount');
    }
    if (!isValidAmount && !isEmpty) {
      setButtonText('Invalid amount');
    }
    if (!address) {
      setButtonText('Connect to restake');
    }
  }, [isSuccess, isError, isValidAmount, isEmpty]);

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
          {!isLoading && !isError && (
            <span
              className={cx(
                (!isValidAmount || !address) && 'opacity-20 text-black'
              )}
            >
              {buttonText}
            </span>
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
