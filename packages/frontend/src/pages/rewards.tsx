import { type GetServerSideProps } from 'next';

export default function HistoryRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return Promise.resolve({
    redirect: { destination: '/history', permanent: true }
  });
};
