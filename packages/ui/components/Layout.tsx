import { ReactNode, useEffect, useRef, useState } from 'react';
import AppNav from './Nav/AppNav';
import { AnimatePresence, motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
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
import { APP_SOCIAL_NAV_ITEMS } from '../config';
import Link from 'next/link';
import Image from 'next/image';

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
          'py-3 px-4 md:px-5',
          'md:max-w-full bg-appBackground',
          'rounded-b-none'
        )}
      />
      <main
        className={cx(
          'p-4 md:px-4 md:pt-2',
          'w-full max-w-full',
          'overflow-x-hidden',
          'min-h-[calc(100vy-50px)]'
        )}
        style={{
          paddingBottom:
            isDesktopOrLaptop || !isMounted ? undefined : mobileNavHeight
        }}
      >
        <div
          className={cx(
            'flex flex-col justify-start items-start w-full relative z-10',
            'pt-6 md:pt-[10vh]'
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
                  'w-full mx-auto md:px-4 pb-8 flex flex-col items-center'
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
        <div className="fixed bottom-8 left-4 pt-4 hidden md:block md:sticky md:mt-auto z-0" />
      </main>
      <footer className="absolute bottom-0 left-0 flex items-end justify-between py-4 px-4 md:px-6 w-full">
        <div className="font-mono text-[10px] opacity-10 leading-[10px]">
          &copy;{new Date().getFullYear()} Rio Network
        </div>
        <div className="flex flex-row items-center gap-4">
          {APP_SOCIAL_NAV_ITEMS.map(({ url, icon, label }, index) => (
            <Link
              href={url}
              key={url + index}
              target="_blank"
              rel="noopener noreferrer"
              className={twJoin(
                'aspect-square rounded-full',
                'flex justify-center items-center font-medium opacity-10',
                'hover:opacity-100 focus:opacity-100 active:opacity-100',
                'hover:outline-0 focus:outline-0 active:outline-0',
                'transition-opacity'
              )}
            >
              <Image
                src={icon}
                width={16}
                height={16}
                alt={label}
                className="dark:invert"
              />
            </Link>
          ))}
        </div>
      </footer>
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
