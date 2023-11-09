import Head from 'next/head';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReactNode, useState } from 'react';
import { APP_TITLE } from '../../config';
import RestakeNav from './Nav/RestakeNav';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [currentTab, setCurrentTab] = useState('restake');
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{APP_TITLE}</title>
      </Head>
      <main className='bg-white p-[12px] rounded-[12px]'>
        <div className='bg-[#EFEFEF] p-8'>
          <div className="container-fluid w-full mx-auto">
            <RestakeNav />
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
          <div className="page">
            <div className="container-fluid w-full mx-auto px-4 md:px-10 py-4">
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
