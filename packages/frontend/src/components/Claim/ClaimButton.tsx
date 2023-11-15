import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Spinner } from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from '../Shared/Alert';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';

type Props = {
  isValid: boolean;
};

const ClaimButton = ({ isValid }: Props) => {
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
    <div className="mt-4">
      <AnimatePresence>
        {!isSuccess && !isError && (
          <motion.button
            className={cx(
              'rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
              !isValid && 'bg-opacity-20',
              isValid && !isLoading && 'hover:bg-[var(--color-dark-gray)]'
            )}
            disabled={!isValid || isLoading}
            onClick={() => {
              async () => {
                await fetchDummyData();
              };
            }}
            variants={TX_BUTTON_VARIANTS}
            key={'claim'}
          >
            {isLoading && (
              <div className="w-full text-center flex items-center justify-center gap-2">
                <Spinner width={16} />
                <span className="opacity-40">Claiming</span>
              </div>
            )}
            {!isLoading && !isError && (
              <span className={cx(!isValid && 'opacity-20 text-black')}>
                {isValid ? 'Claim' : 'Nothing available to claim'}
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
    </div>
  );
};

export default ClaimButton;
