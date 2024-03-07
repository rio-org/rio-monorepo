import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Collapse, Navbar } from '@material-tailwind/react';
import cx from 'classnames';
import logo from '../../assets/rio-logo.png';
import Image from 'next/image';
import { CustomConnectButton } from './CustomConnectButton';
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
  return (
    <motion.nav
      className={cn('lg:flex flex-row gap-1 items-center w-full', className)}
      initial="initial"
      animate="loaded"
      variants={mainNavVariants}
    >
      {items.map(({ label, slug }, index) => (
        <motion.div key={label + index} variants={mainNavChildrenVariants}>
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
        </motion.div>
      ))}
      <SecondaryMenu
        secondaryItems={secondaryItems}
        tertiaryItems={tertiaryItems}
        socialItems={socialItems}
        isSecondaryMenuOpen={isSecondaryMenuOpen}
        setIsSecondaryMenuOpen={setIsSecondaryMenuOpen}
      />
      <CustomConnectButton />
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
                className="w-[37px] h-[37px] lg:w-[32px] lg:h-[32px] aspect-square block my-2"
              >
                <Image
                  src={logo}
                  alt="Rio"
                  width={logoDimensions}
                  height={logoDimensions}
                  className="w-full h-full"
                />
              </Link>
              <div className="hidden lg:flex flex-row gap-1 items-center w-full">
                {isMounted && (
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
              {isMounted && !isDesktopOrLaptop && <CustomConnectButton />}
            </div>
          </div>

          <Collapse open={openNav}>
            <NavList
              secondaryItems={secondaryItems}
              tertiaryItems={tertiaryItems}
              socialItems={socialItems}
              activeTab={activeTab}
              items={items}
            />
          </Collapse>
        </Navbar>
      </>
    );
  }
);
AppNav.displayName = 'AppNav';

export default AppNav;
