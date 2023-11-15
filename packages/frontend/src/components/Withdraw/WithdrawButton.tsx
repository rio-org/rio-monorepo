import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Alert from '../Shared/Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';

type Props = {
  isValid: boolean;
};

const WithdrawButton = ({ isValid }: Props) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
    async () => {
      await fetchDummyData();
    };
  }, []);

  return (
    <AnimatePresence>
      {!isSuccess && !isError && (
        <motion.button
          className={cx(
            'rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
            !isValid && 'bg-opacity-20',
            isValid && 'hover:bg-[var(--color-dark-gray)]'
          )}
          disabled={!isValid || isLoading}
          onClick={() => {
            async () => {
              await fetchDummyData();
            };
          }}
          variants={TX_BUTTON_VARIANTS}
          key={'withdraw'}
        >
          {isLoading && (
            <div className="w-full text-center flex items-center justify-center gap-2">
              <Spinner width={16} />
              <span className="opacity-40">Submitting request</span>
            </div>
          )}
          {!isLoading && !isError && (
            <span className={cx(!isValid && 'opacity-20 text-black')}>
              {isValid ? 'Request withdraw' : 'Enter an amount'}
            </span>
          )}
        </motion.button>
      )}
      <Alert
        isSuccess={isSuccess}
        isError={isError}
        setIsSuccess={setIsSuccess}
        setIsError={setIsError}
      />
    </AnimatePresence>
  );
};

export default WithdrawButton;
