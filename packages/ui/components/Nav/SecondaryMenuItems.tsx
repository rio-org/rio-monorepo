import { MenuItem } from '@material-tailwind/react';
import Link from 'next/link';
import React from 'react';
import { twJoin } from 'tailwind-merge';
import IconLineArrow from '../Icons/IconLineArrow';
import Image from 'next/image';
import { NavItem, SocialNavItem } from '../../lib/typings';

type Props = {
  secondaryItems: NavItem[];
  tertiaryItems: NavItem[];
  socialItems: SocialNavItem[];
  setIsSecondaryMenuOpen: (isOpen: boolean) => void;
};

const SecondaryMenuItems = ({
  secondaryItems,
  tertiaryItems,
  socialItems,
  setIsSecondaryMenuOpen
}: Props) => {
  return (
    <>
      <div>
        {secondaryItems.map(
          ({ label, url, icon }, index) =>
            url && (
              <MenuItem key={label + index}>
                <Link
                  href={url}
                  className="py-1 px-0 hover:text-black flex flex-row gap-2 items-center text-black font-medium"
                  onClick={() => setIsSecondaryMenuOpen(false)}
                >
                  {icon && (
                    <Image src={icon} width={16} height={16} alt={label} />
                  )}
                  {label}
                </Link>
              </MenuItem>
            )
        )}
      </div>
      <hr className="mx-2 my-2 border-t border-black border-opacity-10 bg-transparent " />
      <div className="mb-4">
        {tertiaryItems.map(
          ({ label, url, external }, index) =>
            url && (
              <MenuItem className="group" key={label + index}>
                <Link
                  href={url}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={twJoin(
                    'py-0 px-0 flex flex-row gap-1 items-center',
                    'text-black font-medium opacity-50',
                    'group-hover:opacity-100 text-[14px]'
                  )}
                >
                  {label} <IconLineArrow direction="external" />
                </Link>
              </MenuItem>
            )
        )}
      </div>
      <div className="flex flex-row gap-1 mx-2 mb-2">
        {socialItems.map(({ url, icon, label }, index) => (
          <Link
            href={url}
            key={url + index}
            target="_blank"
            rel="noopener noreferrer"
            className={twJoin(
              'p-2 aspect-square rounded-full',
              'flex justify-center items-center font-medium opacity-40',
              'hover:opacity-100 hover:bg-blue-gray-50 hover:bg-opacity-80',
              'focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80'
            )}
          >
            <Image src={icon} width={16} height={16} alt={label} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default SecondaryMenuItems;