import { type GetServerSideProps } from 'next';

export default function WithdrawRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return Promise.resolve({
    redirect: { destination: '/', permanent: true }
  });
};
