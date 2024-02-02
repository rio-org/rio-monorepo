import type { NextPage } from 'next';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { twJoin } from 'tailwind-merge';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { CustomConnectButton } from '@rio-monorepo/ui/components/Nav/CustomConnectButton';

const OperatorsPage: NextPage = () => {
  const { address } = useAccountIfMounted();

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-start">
      <FormCard.Container title="Operators" header="Manage details">
        <div
          className={twJoin(
            'flex flex-col justify-center items-center gap-6',
            'w-full min-h-[160px] p-4',
            'text-center text-black',
            'rounded-xl bg-black bg-opacity-5'
          )}
        >
          <p className="opacity-50">
            Connect your wallet to edit your operator details
          </p>
          <div>{!address && <CustomConnectButton />}</div>
        </div>
      </FormCard.Container>
      <FormCard.Container header="All operators">
        <div className="mx-auto py-8 text-center">
          <span className="opacity-50" />
        </div>
      </FormCard.Container>
    </div>
  );
};

export default OperatorsPage;
