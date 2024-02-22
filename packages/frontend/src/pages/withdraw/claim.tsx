import { type GetServerSideProps } from 'next';

export default function ClaimRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return Promise.resolve({
    redirect: { destination: '/withdraw', permanent: true }
  });
};
