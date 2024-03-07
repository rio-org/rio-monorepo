import { Menu, MenuHandler, MenuList } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dots from '../../assets/nav-dots.svg';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import SecondaryMenuItems from './SecondaryMenuItems';
import { DESKTOP_MQ } from '../../lib/constants';
import { motion } from 'framer-motion';
import { mainNavChildrenVariants } from '../../lib/motion';
import { NavItem, SocialNavItem } from '../../lib/typings';

type Props = {
  secondaryItems: NavItem[];
  tertiaryItems: NavItem[];
  socialItems: SocialNavItem[];
  isSecondaryMenuOpen: boolean;
  setIsSecondaryMenuOpen: (isOpen: boolean) => void;
};

const SecondaryMenu = ({
  secondaryItems,
  tertiaryItems,
  socialItems,
  isSecondaryMenuOpen,
  setIsSecondaryMenuOpen
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const handleMenuClick = () => {
    setIsSecondaryMenuOpen(!isSecondaryMenuOpen);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <motion.div key={'secondaryMenu'} variants={mainNavChildrenVariants}>
        {isMounted && isDesktopOrLaptop ? (
          <Menu
            placement="bottom-start"
            open={isSecondaryMenuOpen}
            handler={() => {
              isDesktopOrLaptop && handleMenuClick();
            }}
          >
            <MenuHandler>
              <div
                className={cx(
                  'group py-3 px-4 hover:cursor-pointer rounded-xl h-full flex items-center hover:bg-foregroundA1',
                  isSecondaryMenuOpen ? 'bg-foregroundA1' : ''
                )}
              >
                <Image
                  className={cx(
                    'opacity-40 group-hover:opacity-80',
                    isSecondaryMenuOpen ? 'opacity-80' : ''
                  )}
                  src={dots}
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
            </MenuHandler>
            <MenuList>
              <SecondaryMenuItems
                secondaryItems={secondaryItems}
                tertiaryItems={tertiaryItems}
                socialItems={socialItems}
                setIsSecondaryMenuOpen={setIsSecondaryMenuOpen}
              />
            </MenuList>
          </Menu>
        ) : (
          <>
            <button
              onClick={() => handleMenuClick()}
              className={cx(
                'group py-3 px-4 hover:cursor-pointer rounded-xl h-full flex items-center hover:bg-foregroundA1',
                isSecondaryMenuOpen ? 'bg-foregroundA1' : ''
              )}
            >
              <Image
                className={cx(
                  'opacity-40 group-hover:opacity-80',
                  isSecondaryMenuOpen ? 'opacity-80' : ''
                )}
                src={dots}
                alt=""
                width={16}
                height={16}
              />
            </button>
          </>
        )}
      </motion.div>
    </>
  );
};

export default SecondaryMenu;
