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
import { twJoin } from 'tailwind-merge';

export type LayoutProps = {
  appTitle: string;
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
      <AppNav
        ref={appNavRef}
        items={nav.items}
        secondaryItems={nav.secondaryItems}
        tertiaryItems={nav.tertiaryItems}
        socialItems={nav.socialItems}
        logoItem={nav.logoItem}
        className={twJoin(
          'fixed z-[90] py-3 px-4',
          'lg:max-w-[calc(100vw-1.5rem)] bg-[var(--color-app-bg)]',
          'rounded-b-none'
        )}
      />
      <main
        className={cx(
          'p-4 lg:px-4 lg:py-2 relative top-[72px]',
          'w-full max-w-full',
          'overflow-x-hidden overflow-y-auto',
          'h-full max-h-[calc(100%-72px)]'
        )}
      >
        <div
          className={cx(
            'flex flex-col justify-start items-start w-full relative z-10',
            'pt-6 lg:pt-[10vh]'
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
                  'w-full mx-auto lg:px-4 pb-8 flex flex-col items-center'
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
              'fixed bottom-8 left-8 pt-4 hidden lg:block lg:mt-auto z-0'
            )}
          >
            <ReETHConversion />
          </motion.div>
        ) : (
          <div className="fixed bottom-8 left-4 pt-4 hidden lg:block lg:sticky lg:mt-auto z-0" />
        )}
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
