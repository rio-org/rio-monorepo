import Head from 'next/head';
import { ReactNode } from 'react';
import { APP_TITLE } from '../../config';
import AppNav from './Nav/AppNav';

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
      <main className="bg-white p-[12px] h-full font-sans">
        <div className="bg-[#EFEFEF] p-8 rounded-[12px] h-full">
          <div className="container-fluid w-full mx-auto relative">
            <AppNav />
          </div>
          <div className="container-fluid w-full h-full mx-auto px-4 md:px-10 py-4">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
