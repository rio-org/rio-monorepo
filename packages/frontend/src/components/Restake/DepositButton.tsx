import React from 'react';
import cx from 'classnames';

type Props = {
  isValidAmount: boolean;
};

const DepositButton = ({ isValidAmount }: Props) => {
  return (
    <button
      className={cx(
        'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
        !isValidAmount && 'bg-opacity-20',
        isValidAmount && 'hover:bg-[var(--color-dark-gray)]'
      )}
      disabled={!isValidAmount}
      onClick={() => {
        console.log('restake');
      }}
    >
      <span className={cx(!isValidAmount && 'opacity-20 text-black')}>
        {isValidAmount ? 'Restake' : 'Enter an amount'}
      </span>
    </button>
  );
};

export default DepositButton;
