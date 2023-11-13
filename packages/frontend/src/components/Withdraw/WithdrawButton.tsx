import React from 'react';
import cx from 'classnames';

type Props = {
  isValid: boolean;
};

const WithdrawButton = ({ isValid }: Props) => {
  return (
    <button
      className={cx(
        'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
        !isValid && 'bg-opacity-20',
        isValid && 'hover:bg-[var(--color-dark-gray)]'
      )}
      disabled={!isValid}
      onClick={() => {
        console.log('restake');
      }}
    >
      <span className={cx(!isValid && 'opacity-20 text-black')}>
        {isValid ? 'Request withdraw' : 'Enter an amount'}
      </span>
    </button>
  );
};

export default WithdrawButton;
