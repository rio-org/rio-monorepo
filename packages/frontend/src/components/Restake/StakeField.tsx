import React, { useState } from 'react'
import { TokenSymbol } from '../../lib/typings';

type Props = {
  amount: number;
  accountTokenBalance: number;
  tokenSymbol: TokenSymbol;
  setAmount: (amount: number) => void;
}

const StakeField = ({ amount, accountTokenBalance, tokenSymbol, setAmount }: Props) => {
  const [usdAmount, setUsdAmount] = useState(0);

  const handleValueChange = (value: number) => {
    if (!value) value = 0;
    setAmount(value);
    setUsdAmount(value);
  }

  return (
    <div className=''>
      <label htmlFor='amount' className='mb-1 font-medium'>Amount</label>
      <div className='bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl'>
        <div>
          <input
            className='text-[22px] bg-transparent w-full'
            id="amount"
            type='number'
            value={amount}
            placeholder='0.00'
            onChange={(e) => {
              handleValueChange(parseInt(e.target.value as string));
            }}
          />
          <div>
            token selector
          </div>
        </div>
        <div className='text-sm flex justify-between w-full'>
          <span className='opacity-50'>
            ${usdAmount}
          </span>
          <div>
            <span className='opacity-50'>
              Balance: {accountTokenBalance.toFixed(2)} {tokenSymbol}
            </span>
            {" "}
            <button
              className='text-[color:var(--color-blue)] font-medium underline ml-2 hover:[color:var(--color-light-blue)]'
              onClick={() => {
                setAmount(accountTokenBalance);
              }}
            >
              Max
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StakeField