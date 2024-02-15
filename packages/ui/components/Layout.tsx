import { ReactNode, useEffect, useRef, useState } from 'react';
import AppNav from './Nav/AppNav';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
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
  nav: {
    items: InternalAppNavItem[];
    logoItem: LogoNavItem;
    secondaryItems: NavItem[];
    tertiaryItems: NavItem[];
    socialItems: SocialNavItem[];
  };
  children: ReactNode;
};

export default function Layout({ children, nav }: LayoutProps) {
  const isMounted = useIsMounted();
  const [currentSlugIndex, setCurrentSlugIndex] = useState<number>(0);
  const [transitionDirection, setTransitionDirection] = useState<number>(50);
  const appNavRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
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

  const mobileNavHeight =
    (mobileNavRef.current?.firstChild as HTMLElement)?.offsetHeight || 100;

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
      <AppNav
        ref={appNavRef}
        items={nav.items}
        secondaryItems={nav.secondaryItems}
        tertiaryItems={nav.tertiaryItems}
        socialItems={nav.socialItems}
        logoItem={nav.logoItem}
        className={twJoin(
          'absolute z-[90] py-3 px-4',
          'lg:max-w-[calc(100vw-1.5rem)] bg-[var(--color-app-bg)]',
          'rounded-b-none'
        )}
      />
      <main
        className={cx(
          'p-4 lg:px-4 lg:py-2 relative top-[72px]',
          'w-full max-w-full',
          'overflow-x-hidden overflow-y-auto',
          'h-full'
        )}
        style={{
          maxHeight:
            isDesktopOrLaptop || !isMounted
              ? 'calc(100vh - 72px)'
              : `calc(100vh - ${72 + mobileNavHeight}px)`
        }}
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
                      : mobileNavHeight + 'px'
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
        <div className="fixed bottom-8 left-4 pt-4 hidden lg:block lg:sticky lg:mt-auto z-0" />
      </main>
      <div ref={mobileNavRef} className="absolute left-0 bottom-0 z-50">
        <MobileNav
          items={nav.items}
          secondaryItems={nav.secondaryItems}
          tertiaryItems={nav.tertiaryItems}
          socialItems={nav.socialItems}
        />
      </div>
    </>
  );
}
