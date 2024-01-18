import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { Address, zeroAddress } from 'viem';
import { AssetDetails } from '../../lib/typings';

type Props = {
  allowanceTarget?: Address;
  accountAddress: Address;
  isValidAmount: boolean;
  amount: bigint;
  token?: AssetDetails;
  buttonLabel: string;
  isApprovalLoading: boolean;
  refetchAllowance: () => void;
  setIsApprovalSuccess: (isSuccess: boolean) => void;
  setIsApprovalError: (isError: boolean) => void;
  setIsApprovalLoading: (isLoading: boolean) => void;
};

const ApproveButton = ({
  allowanceTarget,
  accountAddress,
  isValidAmount,
  amount,
  token,
  buttonLabel,
  isApprovalLoading,
  refetchAllowance,
  setIsApprovalLoading,
  setIsApprovalSuccess,
  setIsApprovalError
}: Props) => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: token?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [allowanceTarget || zeroAddress, amount],
    enabled: isValidAmount && allowanceTarget && accountAddress ? true : false,
    onError(error) {
      setIsApprovalError(true);
      console.log('Prepare error', error);
    }
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error: writeError,
    isError: isWriteError
  } = useContractWrite(config);

  const transactionResult = useWaitForTransaction({
    hash: writeContractResult?.hash
  });

  const handleExecute = () => {
    setIsApprovalLoading(true);
    setIsButtonLoading(true);
    setIsApprovalError(false);
    approveAsync?.().catch((error) => {
      console.log('Error', error);
    });
  };

  useEffect(() => {
    if (writeError || isWriteError || isPrepareError || prepareError) {
      setIsApprovalError(true);
      setIsApprovalLoading(false);
      setIsButtonLoading(false);
    }
  }, [writeError, isWriteError, prepareError, isPrepareError]);

  useEffect(() => {
    if (transactionResult.data) {
      refetchAllowance();
      setIsApprovalSuccess(true);
      setIsApprovalError(false);
      setIsApprovalLoading(false);
      setIsButtonLoading(false);
    }
    if (transactionResult.error) {
      setIsApprovalError(true);
      setIsApprovalLoading(false);
      setIsButtonLoading(false);
    }
  }, [transactionResult.data, transactionResult.error]);

  return (
    <AnimatePresence>
      <motion.button
        className={cx(
          'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
          !isValidAmount && 'bg-opacity-20',
          (isValidAmount || isApprovalLoading) &&
            !isApprovalLoading &&
            'hover:bg-[var(--color-dark-gray)]',
          isApprovalLoading &&
            !isButtonLoading &&
            'bg-opacity-50 !hover:bg-opacity-50'
        )}
        disabled={!isValidAmount || isApprovalLoading}
        onClick={() => {
          handleExecute();
        }}
        variants={TX_BUTTON_VARIANTS}
        key={buttonLabel}
      >
        {isButtonLoading ? (
          <span className="flex items-center justify-center">
            <span className="w-4 h-4 mb-2">
              <Spinner />
            </span>
          </span>
        ) : (
          <span
            className={cx(
              !isValidAmount && 'opacity-20 text-black',
              isApprovalLoading && 'opacity-20'
            )}
          >
            {buttonLabel}
          </span>
        )}
      </motion.button>
    </AnimatePresence>
  );
};

export default ApproveButton;
