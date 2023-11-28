import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Collapse, Navbar } from '@material-tailwind/react';
import cx from 'classnames';
import { APP_NAV_ITEMS } from '../../../config';
import logo from '../../assets/rio-logo.png';
import Image from 'next/image';
import { CustomConnectButton } from './CustomConnectButton';
import SecondaryMenu from './SecondaryMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { mainNavChildrenVariants, mainNavVariants } from '../../lib/motion';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';

const slugUrl = (slug: string) => {
  if (slug === '/') return '/';
  return `/${slug}`;
};

const NavList = ({ activeTab }: { activeTab: string }) => {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = React.useState(false);
  return (
    <>
      <motion.nav
        className="lg:flex flex-row gap-1 items-center w-full"
        initial="initial"
        animate="loaded"
        variants={mainNavVariants}
      >
        {APP_NAV_ITEMS.map(({ label, slug }, index) => (
          <motion.div key={label + index} variants={mainNavChildrenVariants}>
            <Link
              href={slugUrl(slug)}
              key={label + index}
              scroll={false}
              className={cx(
                'py-2 px-4 font-medium  rounded-xl hover:text-black hover:bg-[var(--color-element-wrapper-bg)]',
                activeTab === slug ? 'text-black' : 'text-gray-500'
              )}
            >
              {label}
            </Link>
          </motion.div>
        ))}
        <SecondaryMenu
          isSecondaryMenuOpen={isSecondaryMenuOpen}
          setIsSecondaryMenuOpen={setIsSecondaryMenuOpen}
        />
        <CustomConnectButton />
      </motion.nav>
    </>
  );
};

const AppNav = () => {
  const [openNav] = useState(false);
  const logoDimensions = 37;
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const activeTab =
    APP_NAV_ITEMS.find((item) => baseUrlSegment.includes(item.slug))?.slug ||
    APP_NAV_ITEMS[0].slug;
  const [isMounted, setIsMounted] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Navbar
        className="mx-auto max-w-none"
        variant="filled"
        color="transparent"
      >
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex flex-row gap-4 items-center justify-between w-full">
            <Link
              href={slugUrl('/')}
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
                  <NavList activeTab={activeTab} />
                </AnimatePresence>
              )}
            </div>
            {isMounted && !isDesktopOrLaptop && <CustomConnectButton />}
          </div>
        </div>

        <Collapse open={openNav}>
          <NavList activeTab={activeTab} />
        </Collapse>
      </Navbar>
    </>
  );
};

export default AppNav;
