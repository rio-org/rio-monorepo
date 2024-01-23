import React from 'react';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { OPERATOR_KEYS_NAV_ITEMS } from '../../../config';

type Props = {
  children: React.ReactNode;
  noPadding?: boolean;
};

const OperatorKeysWrapper = ({ children, noPadding }: Props) => {
  return (
    <div className="min-h-[inherit] w-full flex justify-center items-start">
      <FormCard.Container
        title="Operator Keys"
        header={<FormCard.Tabs baseUrl="/" items={OPERATOR_KEYS_NAV_ITEMS} />}
        noPadding={noPadding}
      >
        {children}
      </FormCard.Container>
    </div>
  );
};

export default OperatorKeysWrapper;
