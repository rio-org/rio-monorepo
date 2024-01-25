import Head from 'next/head';
import { ReactNode, useEffect, useRef, useState } from 'react';
import AppNav from './Nav/AppNav';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import ReETHConversion from './Shared/ReETHConversion';
import MobileNav from './Nav/MobileNav';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../lib/constants';
import cx from 'classnames';
import { useIsMounted } from '../hooks/useIsMounted';
import {
  InternalAppNavItem,
  LogoNavItem,
  NavItem,
  SocialNavItem
} from '../lib/typings';

type LayoutProps = {
  appTitle?: string;
  nav: {
    items: InternalAppNavItem[];
    logoItem: LogoNavItem;
    secondaryItems: NavItem[];
    tertiaryItems: NavItem[];
    socialItems: SocialNavItem[];
  };
  showExchangeRates?: boolean;
  children: ReactNode;
};

export default function Layout({
  children,
  nav,
  appTitle,
  showExchangeRates = true
}: LayoutProps) {
  const isMounted = useIsMounted();
  const [currentSlugIndex, setCurrentSlugIndex] = useState<number>(0);
  const [transitionDirection, setTransitionDirection] = useState<number>(50);
  const appNavRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const conversionButtonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const nextSlugIndex = (slug: string) => {
    return nav.items.findIndex((item) => item.slug === slug) + 1;
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
      nav.items.findIndex((item) => item.slug === router.pathname.split('/')[1])
    );
  }, [router, nav.items]);

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
        <title>{appTitle}</title>
      </Head>
      <main
        className={cx(
          'bg-[var(--color-app-bg)] lg:bg-white lg:p-[12px] lg:flex w-full min-h-full font-sans'
        )}
      >
        <div
          className={cx(
            'bg-[var(--color-app-bg)] p-4 lg:px-4 lg:py-2 rounded-[12px] relative w-full lg:flex lg:flex-col lg:justify-center'
          )}
        >
          <div
            ref={appNavRef}
            className="container-fluid w-full mx-auto pt-2 pb-6 lg:pb-[10vh] "
          >
            <AppNav
              items={nav.items}
              secondaryItems={nav.secondaryItems}
              tertiaryItems={nav.tertiaryItems}
              socialItems={nav.socialItems}
              logoItem={nav.logoItem}
            />
          </div>
          <div
            className={cx(
              'flex flex-col justify-start items-start w-full relative z-10'
            )}
            ref={contentRef}
          >
            <AnimatePresence mode={'wait'} initial={false}>
              <motion.div
                className="w-full"
                key={baseUrlSegment}
                initial={'initialState'}
                animate={'animateState'}
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
                  className={cx(
                    'container-fluid mx-auto lg:px-4 pb-8 flex items-center'
                  )}
                  style={{
                    paddingBottom:
                      isMounted && isDesktopOrLaptop
                        ? '0px'
                        : (mobileNavRef.current?.offsetHeight || 100) + 'px'
                  }}
                  initial={{ opacity: 0 }}
                  animate={isMounted && { opacity: 1 }}
                  exit={{ opacity: 0 }}
                  ref={contentWrapperRef}
                >
                  {children}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          {showExchangeRates ? (
            <motion.div
              ref={conversionButtonRef}
              key={'conversionButton'}
              initial={{ opacity: 0 }}
              animate={isMounted && { opacity: 1 }}
              transition={{
                type: 'spring',
                duration: 0.1,
                delay: 0.5
              }}
              className={cx(
                'sticky bottom-8 left-4 pt-4 hidden lg:block lg:sticky lg:mt-auto z-0'
              )}
            >
              <ReETHConversion />
            </motion.div>
          ) : (
            <div className="sticky bottom-8 left-4 pt-4 hidden lg:block lg:sticky lg:mt-auto z-0" />
          )}
        </div>
        <div ref={mobileNavRef} className="relative z-50">
          <MobileNav
            items={nav.items}
            secondaryItems={nav.secondaryItems}
            tertiaryItems={nav.tertiaryItems}
            socialItems={nav.socialItems}
          />
        </div>
      </main>
    </>
  );
}
