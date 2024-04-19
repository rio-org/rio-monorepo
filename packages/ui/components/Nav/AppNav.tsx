import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Collapse, Navbar } from '@material-tailwind/react';
import cx from 'classnames';
import SecondaryMenu from './SecondaryMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { mainNavChildrenVariants, mainNavVariants } from '../../lib/motion';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { useIsMounted } from '../../hooks/useIsMounted';
import {
  InternalAppNavItem,
  LogoNavItem,
  NavItem,
  SocialNavItem
} from '../../lib/typings';
import { cn } from '../../lib/utilities';
import { ThemeSelector } from '../Shared/ThemeSelector';
import { IconRio } from '../Icons/IconRio';
import { ConnectWalletMenu } from '../Shared/ConnectWalletMenu';
import { IconArrowDiagonal } from '../Icons/IconArrowDiagonal';
import { twJoin } from 'tailwind-merge';
import { DOCUMENTATION_NAV_ITEM } from '../../config';
import { Button } from '../shadcn/button';

const slugUrl = (slug: string) => {
  if (slug === '/') return '/';
  return `/${slug}`;
};

const NavList = ({
  items,
  secondaryItems,
  tertiaryItems,
  socialItems,
  activeTab,
  className
}: {
  items: InternalAppNavItem[];
  secondaryItems: NavItem[];
  tertiaryItems: NavItem[];
  socialItems: SocialNavItem[];
  activeTab: string;
  className?: string;
}) => {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = React.useState(false);
  const secondaryMenuHasVisibleItems = secondaryItems.some(
    (it) => it.url && !it.disabled && !it.hideOn?.includes('desktop')
  );

  return (
    <motion.nav
      className={cn(
        'md:flex flex-row gap-1 justify-between items-center w-full',
        className
      )}
      initial="initial"
      animate="loaded"
      variants={mainNavVariants}
    >
      <ul className="list-none flex gap-1 items-center">
        {items.map(({ label, slug }, index) => (
          <motion.li key={label + index} variants={mainNavChildrenVariants}>
            <Link
              href={slugUrl(slug)}
              key={label + index}
              scroll={false}
              className={cx(
                'py-2 px-4 font-medium  rounded-xl hover:text-foreground hover:bg-foregroundA1 duration-75',
                activeTab === slug ? 'text-foreground' : 'text-foregroundA6'
              )}
            >
              {label}
            </Link>
          </motion.li>
        ))}
        {secondaryMenuHasVisibleItems && (
          <SecondaryMenu
            secondaryItems={secondaryItems}
            tertiaryItems={tertiaryItems}
            socialItems={socialItems}
            isSecondaryMenuOpen={isSecondaryMenuOpen}
            setIsSecondaryMenuOpen={setIsSecondaryMenuOpen}
          />
        )}
      </ul>
      <div className="flex justify-end items-center gap-2">
        <Button variant="link" asChild className="h-8 p-0 no-underline">
          <a
            className={twJoin(
              'hidden md:flex items-center gap-0.5 px-3 rounded-[4px]',
              'text-foreground opacity-60 duration-75 cursor-pointer !no-underline',
              'hover:bg-foregroundA1 hover:opacity-100 focus:bg-foregroundA1 focus:opacity-100',
              '[&:focus-visible]:outline-0 [&:focus-visible]:ring-2 ring-foreground'
            )}
            href={DOCUMENTATION_NAV_ITEM.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="leading-none">Docs</span>
            <IconArrowDiagonal className="[&>fill" />{' '}
          </a>
        </Button>
        <ThemeSelector />
        <ConnectWalletMenu />
      </div>
    </motion.nav>
  );
};

const AppNav = React.forwardRef<
  HTMLDivElement,
  {
    items: InternalAppNavItem[];
    secondaryItems: NavItem[];
    tertiaryItems: NavItem[];
    socialItems: SocialNavItem[];
    logoItem: LogoNavItem;
    className?: string;
  }
>(
  (
    { items, secondaryItems, tertiaryItems, socialItems, logoItem, className },
    ref
  ) => {
    const [openNav] = useState(false);
    const logoDimensions = 37;
    const router = useRouter();
    const baseUrlSegment = router.pathname.split('/')[1];
    const activeTab =
      items.find((item) => baseUrlSegment.includes(item.slug))?.slug ||
      items?.[0]?.slug;
    const isMounted = useIsMounted();
    const isDesktopOrLaptop = useMediaQuery({
      query: DESKTOP_MQ
    });

    return (
      <>
        <Navbar
          ref={ref}
          className={cn('mx-auto max-w-full  z-[9999]', className)}
          variant="filled"
          color="transparent"
        >
          <div className="flex items-center justify-between text-foreground">
            <div className="flex flex-row gap-4 items-center justify-between w-full">
              <Link
                href={logoItem.url}
                target={logoItem.external ? '_blank' : undefined}
                rel={logoItem.external ? 'noopener noreferrer' : undefined}
                className="w-[37px] h-[37px] md:w-[32px] md:h-[32px] aspect-square block my-2"
              >
                <IconRio
                  width={logoDimensions}
                  height={logoDimensions}
                  className="w-full h-full"
                />
              </Link>
              <div className="hidden md:flex flex-row gap-1 items-center w-full">
                {isMounted && isDesktopOrLaptop && (
                  <AnimatePresence>
                    <NavList
                      secondaryItems={secondaryItems}
                      tertiaryItems={tertiaryItems}
                      socialItems={socialItems}
                      activeTab={activeTab}
                      items={items}
                    />
                  </AnimatePresence>
                )}
              </div>
              {isMounted && !isDesktopOrLaptop && (
                <div className="flex justify-end items-center gap-4">
                  <ThemeSelector />
                  <ConnectWalletMenu />
                </div>
              )}
            </div>
          </div>

          {!isDesktopOrLaptop && (
            <Collapse open={openNav}>
              <NavList
                secondaryItems={secondaryItems}
                tertiaryItems={tertiaryItems}
                socialItems={socialItems}
                activeTab={activeTab}
                items={items}
              />
            </Collapse>
          )}
        </Navbar>
      </>
    );
  }
);
AppNav.displayName = 'AppNav';

export default AppNav;
