import Head from 'next/head';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';
import { APP_TITLE } from '../../config';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{APP_TITLE}</title>
      </Head>
      <main>
        <div className="container-fluid w-full mx-auto">
          <div className="flex w-full justify-between align-center py-2 px-4 md:px-10 border-b-2 border-slate-100 border-opacity-10">
            <h1 className="text-2xl">
              <Link className="font-bold leading-none self-center" href="/">
                {APP_TITLE}
              </Link>
            </h1>
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
        </div>
        <div className="page">
          <div className="container-fluid w-full mx-auto px-4 md:px-10 py-4">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
