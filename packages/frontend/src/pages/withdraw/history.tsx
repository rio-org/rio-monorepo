import { type GetServerSideProps } from 'next';

export default function WithdrawHistoryRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return Promise.resolve({
    redirect: { destination: '/withdraw', permanent: true }
  });
};
