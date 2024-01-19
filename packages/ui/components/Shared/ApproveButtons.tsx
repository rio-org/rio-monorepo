import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from './Alert';
import { TOKEN_CAP_MAX } from '../../lib/constants';
import { parseUnits, Address } from 'viem';
import { AssetDetails } from '../../lib/typings';
import ApproveButton from './ApproveButton';

type Props = {
  allowanceTarget?: Address;
  accountAddress: Address;
  isValidAmount: boolean;
  amount: bigint;
  token?: AssetDetails;
  refetchAllowance: () => void;
};

const ApproveButtons = ({
  allowanceTarget,
  accountAddress,
  isValidAmount,
  amount,
  token,
  refetchAllowance
}: Props) => {
  const [isApprovalSuccess, setIsApprovalSuccess] = useState(false);
  const [isApprovalError, setIsApprovalError] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);

  return (
    <div>
      <AnimatePresence>
        {(isApprovalSuccess || isApprovalError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.05 }}
            key={'approvalAlert'}
          >
            <div className="mt-4">
              <Alert
                isSuccess={isApprovalSuccess}
                isError={isApprovalError}
                setIsSuccess={setIsApprovalSuccess}
                setIsError={setIsApprovalError}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-row gap-2" key={'approveWrapper'}>
        <ApproveButton
          key="approveButton"
          allowanceTarget={allowanceTarget}
          accountAddress={accountAddress}
          isValidAmount={isValidAmount}
          token={token}
          amount={amount || BigInt(0)}
          buttonLabel="Approve"
          isApprovalLoading={isApprovalLoading}
          setIsApprovalLoading={setIsApprovalLoading}
          setIsApprovalSuccess={setIsApprovalSuccess}
          setIsApprovalError={setIsApprovalError}
          refetchAllowance={refetchAllowance}
        />
        <ApproveButton
          key="approveInfiniteButton"
          allowanceTarget={allowanceTarget}
          accountAddress={accountAddress}
          isValidAmount={isValidAmount}
          token={token}
          amount={parseUnits(TOKEN_CAP_MAX, 18)}
          buttonLabel="Approve infinite"
          isApprovalLoading={isApprovalLoading}
          setIsApprovalLoading={setIsApprovalLoading}
          setIsApprovalSuccess={setIsApprovalSuccess}
          setIsApprovalError={setIsApprovalError}
          refetchAllowance={refetchAllowance}
        />
      </div>
    </div>
  );
};

export default ApproveButtons;
