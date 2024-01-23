import React from 'react';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { WITHDRAW_NAV_ITEMS } from '../../../config';

type Props = {
  children: React.ReactNode;
  noPadding?: boolean;
};

const WithdrawWrapper = ({ children, noPadding }: Props) => {
  return (
    <div className="min-h-[inherit] w-full flex justify-center items-start">
      <FormCard.Container
        title="Withdraw"
        header={
          <FormCard.Tabs baseUrl="/withdraw" items={WITHDRAW_NAV_ITEMS} />
        }
        noPadding={noPadding}
      >
        {children}
      </FormCard.Container>
    </div>
  );
};

export default WithdrawWrapper;
