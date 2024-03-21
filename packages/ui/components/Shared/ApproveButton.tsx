import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { TX_BUTTON_VARIANTS } from '../../lib/constants';
import {
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { erc20Abi, type Address, getAddress, zeroAddress } from 'viem';
import { AssetDetails } from '../../lib/typings';
import { NATIVE_ETH_ADDRESS } from '../../config';

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
    data: simulatedData,
    error: prepareError,
    isError: isPrepareError
  } = useSimulateContract({
    address: token?.address,
    abi: erc20Abi,
    functionName: 'approve',
    args: [allowanceTarget || zeroAddress, amount],
    query: {
      enabled:
        !!isValidAmount &&
        !!allowanceTarget &&
        getAddress(allowanceTarget) !== NATIVE_ETH_ADDRESS &&
        !!accountAddress
    }
  });

  const {
    data: hash,
    writeContractAsync: approveAsync,
    error: writeError,
    isError: isWriteError
  } = useWriteContract();

  const transactionResult = useWaitForTransactionReceipt({
    hash
  });

  useEffect(() => {
    if (!prepareError) return;
    setIsApprovalError(true);
    console.error('Prepare error', prepareError);
  });

  const handleExecute = () => {
    if (!simulatedData?.request) return;
    setIsApprovalLoading(true);
    setIsButtonLoading(true);
    setIsApprovalError(false);
    approveAsync?.(simulatedData.request).catch((error) => {
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
          'mt-4 rounded-full w-full py-3 font-bold bg-primary text-primary-foreground transition-colors duration-200',
          !isValidAmount && 'bg-opacity-20',
          (isValidAmount || isApprovalLoading) &&
            !isApprovalLoading &&
            'hover:bg-primaryA3',
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
              !isValidAmount && 'opacity-20 text-primary-foreground',
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
