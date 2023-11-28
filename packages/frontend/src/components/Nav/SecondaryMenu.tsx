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

type Props = {
  isSecondaryMenuOpen: boolean;
  setIsSecondaryMenuOpen: (isOpen: boolean) => void;
};

const SecondaryMenu = ({
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
      <motion.div
        key={'secondaryMenu'}
        variants={mainNavChildrenVariants}>
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
                  'group py-3 px-4 hover:cursor-pointer rounded-xl h-full flex items-center hover:bg-[var(--color-element-wrapper-bg)]',
                  isSecondaryMenuOpen
                    ? 'bg-[var(--color-element-wrapper-bg)]'
                    : ''
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
                setIsSecondaryMenuOpen={setIsSecondaryMenuOpen}
              />
            </MenuList>
          </Menu>
        ) : (
          <>
            <button
              onClick={() => handleMenuClick()}
              className={cx(
                'group py-3 px-4 hover:cursor-pointer rounded-xl h-full flex items-center hover:bg-[var(--color-element-wrapper-bg)]',
                isSecondaryMenuOpen
                  ? 'bg-[var(--color-element-wrapper-bg)]'
                  : ''
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
