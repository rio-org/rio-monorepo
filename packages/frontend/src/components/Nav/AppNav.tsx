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


const NavList = ({ activeTab }: {
  activeTab: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  }

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
        <Menu placement="bottom-start" open={isMenuOpen} handler={() => {
          handleMenuClick();
        }}>
          <MenuHandler>
            <div className={cx(
              "group py-4 px-4 hover:cursor-pointer rounded-xl h-full flex items-center hover:bg-[var(--color-element-wrapper-bg)]",
              isMenuOpen ? 'bg-[var(--color-element-wrapper-bg)]' : ''
            )}>
              <Image
                className={cx('opacity-40 group-hover:opacity-80', isMenuOpen ? 'opacity-80' : '')}
                src={dots} alt="" width={16} height={16} />
            </div>
          </MenuHandler>
          <MenuList>
            <div>
              {APP_SECONDARY_NAV_ITEMS.map(({ label, url, icon }, index) => (
                <MenuItem>
                  <Link
                    href={url}
                    key={index}
                    className="py-1 px-0 hover:text-black flex flex-row gap-2 items-center text-black font-medium"
                  >
                    <Image src={icon} width={16} height={16} alt={label} />
                    {label}
                  </Link>
                </MenuItem>
              ))}
            </div>
            <hr className="mx-2 my-2 border-t border-black border-opacity-10 bg-transparent " />
            <div className="mb-4">
              {APP_TERTIARY_NAV_ITEMS.map(({ label, url }, index) => (
                <MenuItem className='group'>
                  <Link
                    href={url}
                    key={index}
                    className="py-0 px-0 text-black flex flex-row gap-1 items-center opacity-50 group-hover:opacity-100 text-[12px] font-medium"
                  >
                    {label} <IconLineArrow direction="external" />
                  </Link>
                </MenuItem>
              ))}
            </div>
            <div className="flex flex-row gap-1 ml-2 mb-2">
              {APP_SOCIAL_NAV_ITEMS.map(({ url, icon }, index) => (
                <Link
                  href={url}
                  key={index}
                  className="p-2 aspect-square rounded-full font-medium opacity-40 hover:opacity-100 hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80"
                >
                  <Image src={icon} width={16} height={16} alt={''} />
                </Link>
              ))}
            </div>
          </MenuList>
        </Menu>
      </div >
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
      className="mx-auto max-w-screen-xl"
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
