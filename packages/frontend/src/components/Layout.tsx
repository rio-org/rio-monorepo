import Head from 'next/head';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { APP_TITLE } from '../../config';
import AppNav from './Nav/AppNav';
import useWindowSize from '../hooks/useWindowSize';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const [appCanvasHeight, setappCanvasHeight] = useState(0);

  useLayoutEffect(() => {
    if (ref.current && ref.current.offsetHeight && windowSize.height > 0) {
      setappCanvasHeight(windowSize.height - ref.current.offsetHeight - 48);
    }
  }, [windowSize, ref]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{APP_TITLE}</title>
      </Head>
      <main className="bg-white p-[12px] h-full font-sans">
        <div className="bg-[#EFEFEF] px-4 py-2 rounded-[12px] min-h-full bg-fixed">
          <div ref={ref} className="container-fluid w-full mx-auto relative mb-4">
            <AppNav />
          </div>
          <div
            className="container-fluid w-full mx-auto px-4 pb-8 md:px-10 flex items-center"
            style={{ minHeight: appCanvasHeight }}
          >
            {children}
          </div>
        </div>
      </main >
    </>
  );
}
