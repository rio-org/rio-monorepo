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
import cx from 'classnames';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [appCanvasHeight, setappCanvasHeight] = useState(0);
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
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
          <div className={cx('min-h-[80vh]')}>
            <AnimatePresence mode={'wait'}>
              <motion.div
                key={baseUrlSegment}
                initial={false}
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
                <motion.div
                  className="container-fluid w-full mx-auto lg:px-4 pb-8 flex items-center"
                  style={{
                    minHeight:
                      isMounted && isDesktopOrLaptop ? appCanvasHeight : '100%',
                    paddingBottom:
                      isMounted && isDesktopOrLaptop
                        ? '0px'
                        : (mobileNavRef.current?.offsetHeight || 80) + 'px'
                  }}
                  initial={{ opacity: 0 }}
                  animate={isMounted && { opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {children}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div
            ref={conversionButtonRef}
            className="sticky bottom-4 left-0 pb-1 hidden lg:block"
          >
            <ReETHConversion />
          </div>
        </div>
        <div ref={mobileNavRef}>
          <MobileNav />
        </div>
      </main>
    </>
  );
}
