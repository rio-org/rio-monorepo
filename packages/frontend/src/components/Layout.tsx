import Head from 'next/head';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { APP_NAV_ITEMS, APP_TITLE } from '../../config';
import AppNav from './Nav/AppNav';
import useWindowSize from '../hooks/useWindowSize';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import ReETHConversion from './Shared/ReETHConversion';
import MobileNav from './Nav/MobileNav';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../lib/constants';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [appCanvasHeight, setappCanvasHeight] = useState(0);
  const [appCanvasPB, setAppCanvasPB] = useState<number>(0);
  const [currentSlugIndex, setCurrentSlugIndex] = useState<number>(0); // APP_NAV_ITEMS[0
  const [transitionDirection, setTransitionDirection] = useState<number>(50);
  const appNavRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const conversionButtonRef = useRef<HTMLDivElement>(null);
  const hasWindow = typeof window !== 'undefined';
  const win = hasWindow ? (window as Window) : undefined;
  const windowSize = useWindowSize(win);
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const nextSlugIndex = (slug: string) => {
    return APP_NAV_ITEMS.findIndex((item) => item.slug === slug) + 1;
  };

  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

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

  useEffect(() => {
    const appPadding = 40; // outer and inner wrapper paddings
    if (
      isMounted &&
      !isDesktopOrLaptop &&
      appNavRef.current &&
      mobileNavRef.current &&
      appNavRef.current.offsetHeight &&
      windowSize.height > 0
    ) {
      setappCanvasHeight(
        windowSize.height -
        appNavRef.current.offsetHeight -
        appPadding -
        mobileNavRef.current.offsetHeight
      );
      setAppCanvasPB(mobileNavRef.current.offsetHeight);
    } else if (
      isMounted &&
      appNavRef.current &&
      conversionButtonRef.current &&
      windowSize.height > 0
    ) {
      setappCanvasHeight(
        windowSize.height -
        appNavRef.current.offsetHeight -
        conversionButtonRef.current.offsetHeight -
        appPadding
      );
    }
  }, [windowSize, appNavRef, mobileNavRef, isDesktopOrLaptop, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{APP_TITLE}</title>
      </Head>
      <main className="bg-[var(--color-app-bg)] lg:bg-white lg:p-[12px] min-h-full font-sans">
        <div className="bg-[var(--color-app-bg)] p-4 lg:px-4 lg:py-2 rounded-[12px] bg-fixed relative min-h-full">
          <div
            ref={appNavRef}
            className="container-fluid w-full mx-auto pt-2 pb-6 lg:pb-4"
          >
            <AppNav />
          </div>
          <AnimatePresence mode={'wait'}>
            <motion.div
              key={baseUrlSegment}
              initial={isDesktopOrLaptop && 'initialState'}
              animate={isDesktopOrLaptop && 'animateState'}
              exit={'exitState'}
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
                className="container-fluid w-full mx-auto lg:px-4 pb-8 flex items-center"
                style={{
                  minHeight:
                    isMounted && isDesktopOrLaptop ? appCanvasHeight : '100%',
                  paddingBottom:
                    isMounted && isDesktopOrLaptop
                      ? '0px'
                      : appCanvasPB + (mobileNavRef.current?.offsetHeight || 80) + 30 + 'px'
                }}
              >
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
          <div
            ref={conversionButtonRef}
            className="sticky bottom-4 left-0 pb-1 hidden lg:block"
          >
            <ReETHConversion />
          </div>
        </div>
        {/* {isMounted && !isDesktopOrLaptop && ( */}
        <div ref={mobileNavRef}>
          <MobileNav />
        </div>

        {/* )} */}
      </main>
    </>
  );
}
