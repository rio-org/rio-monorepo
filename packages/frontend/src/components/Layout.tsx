import Head from 'next/head';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { APP_NAV_ITEMS, APP_TITLE } from '../../config';
import AppNav from './Nav/AppNav';
import useWindowSize from '../hooks/useWindowSize';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasWindow = typeof window !== 'undefined';
  const win = hasWindow ? (window as Window) : undefined;
  const windowSize = useWindowSize(win);
  const [appCanvasHeight, setappCanvasHeight] = useState(0);
  const [currentSlugIndex, setCurrentSlugIndex] = useState<number>(0); // APP_NAV_ITEMS[0
  const [transitionDirection, setTransitionDirection] = useState<number>(50);
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const nextSlugIndex = (slug: string) => {
    return APP_NAV_ITEMS.findIndex((item) => item.slug === slug) + 1;
  };

  useEffect(() => {
    if (nextSlugIndex(baseUrlSegment) > currentSlugIndex) {
      setTransitionDirection(-50);
    } else {
      setTransitionDirection(50);
    }
    setCurrentSlugIndex(
      APP_NAV_ITEMS.findIndex(
        (item) => item.slug === router.pathname.split('/')[1]
      )
    );
  }, [router]);

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
          <div
            ref={ref}
            className="container-fluid w-full mx-auto relative mb-4"
          >
            <AppNav />
          </div>
          <AnimatePresence mode={'wait'}>
            <motion.div
              key={baseUrlSegment}
              initial="initialState"
              animate="animateState"
              exit="exitState"
              transition={{
                type: 'spring',
                duration: 0.1
              }}
              variants={{
                initialState: {
                  opacity: 0,
                  x: transitionDirection
                },
                animateState: {
                  opacity: 1,
                  x: 0
                },
                exitState: {
                  opacity: 0,
                  x: transitionDirection
                }
              }}
            >
              <div
                className="container-fluid w-full mx-auto px-4 pb-8 md:px-10 flex items-center"
                // todo: mobile considerations
                style={{ minHeight: appCanvasHeight }}
              >
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
