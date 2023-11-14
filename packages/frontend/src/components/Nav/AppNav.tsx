import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Collapse,
  IconButton,
  Navbar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList
} from '@material-tailwind/react';
import cx from 'classnames';
import {
  APP_NAV_ITEMS,
  APP_SECONDARY_NAV_ITEMS,
  APP_SOCIAL_NAV_ITEMS,
  APP_TERTIARY_NAV_ITEMS
} from '../../../config';
import logo from '../../assets/rio-logo.svg';
import dots from '../../assets/nav-dots.svg';
import Image from 'next/image';
import { CustomConnectButton } from './CustomConnectButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import IconLineArrow from '../Icons/IconLineArrow';

type Props = {
  activeTab: string;
};

const NavList = ({ activeTab }: Props) => {
  return (
    <>
      {APP_NAV_ITEMS.map(({ label, slug }) => (
        <Link
          href={slug}
          key={slug}
          className={cx(
            'py-2 px-4 font-medium hover:text-black',
            activeTab === slug ? '' : 'text-gray-500'
          )}
          passHref
        >
          {label}
        </Link>
      ))}
      <div>
        <Menu placement="bottom-start">
          <MenuHandler>
            <div className="py-2 px-4 hover:cursor-pointer opacity-40 hover:opacity-80">
              <Image src={dots} alt="Rio" width={16} height={16} />
            </div>
          </MenuHandler>
          <MenuList>
            <div>
              {APP_SECONDARY_NAV_ITEMS.map(({ label, url, icon }) => (
                <MenuItem>
                  <Link
                    href={url}
                    key={url}
                    className="py-1 px-0 font-medium hover:text-black flex flex-row gap-2 items-center text-black font-medium"
                  >
                    <Image src={icon} width={16} height={16} alt={label} />
                    {label}
                  </Link>
                </MenuItem>
              ))}
            </div>
            <hr className="mx-2 my-2 border-t border-black border-opacity-10 bg-transparent " />
            <div className="mb-5">
              {APP_TERTIARY_NAV_ITEMS.map(({ label, url }) => (
                <MenuItem>
                  <Link
                    href={url}
                    key={url}
                    className="py-0 px-0 text-black flex flex-row gap-1 items-center opacity-50 hover:opacity-100 text-[12px] font-medium"
                  >
                    {label} <IconLineArrow direction="external" />
                  </Link>
                </MenuItem>
              ))}
            </div>
            <div className="flex flex-row gap-2 ml-2 mb-4">
              {APP_SOCIAL_NAV_ITEMS.map(({ url, icon }) => (
                <Link
                  href={url}
                  key={url}
                  className="py-0 px-1 font-medium opacity-40 hover:opacity-100"
                >
                  <Image src={icon} width={16} height={16} alt={''} />
                </Link>
              ))}
            </div>
          </MenuList>
        </Menu>
      </div>
    </>
  );
};

const AppNav = () => {
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const activeTab =
    APP_NAV_ITEMS.find((item) => baseUrlSegment.includes(item.slug))?.slug ||
    APP_NAV_ITEMS[0].slug;

  const [openNav, setOpenNav] = React.useState(false);

  // todo: add back in if mobile design is a hamburger menu
  // const handleWindowResize = () =>
  //   window.innerWidth >= 960 && setOpenNav(false);

  // React.useEffect(() => {
  //   window.addEventListener("resize", handleWindowResize);

  //   return () => {
  //     window.removeEventListener("resize", handleWindowResize);
  //   };
  // }, []);

  return (
    <Navbar
      className="mx-auto max-w-screen-xl px-6 py-3"
      variant="filled"
      color="transparent"
    >
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex flex-row gap-4 items-center">
          <Link href="/">
            <Image src={logo} alt="Rio" width={32} height={32} />
          </Link>
          <div className="hidden lg:flex flex-row gap-1 items-center">
            <NavList activeTab={activeTab} />
          </div>
        </div>
        <div>
          <CustomConnectButton />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList activeTab={activeTab} />
      </Collapse>
    </Navbar>
  );
};

export default AppNav;
