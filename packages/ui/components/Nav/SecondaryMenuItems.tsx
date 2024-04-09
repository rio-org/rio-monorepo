import { MenuItem } from '@material-tailwind/react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { twJoin } from 'tailwind-merge';
import IconLineArrow from '../Icons/IconLineArrow';
import Image from 'next/image';
import { NavItem, SocialNavItem } from '../../lib/typings';
import { DESKTOP_MQ } from '../../lib/constants';
import { useMediaQuery } from 'react-responsive';

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
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  const visibleSecondaryItems = useMemo(
    () =>
      secondaryItems.filter(
        (it) =>
          it.url &&
          !it.hideOn?.includes(isDesktopOrLaptop ? 'desktop' : 'mobile')
      ),
    [secondaryItems]
  );

  const visibleTertiaryItems = useMemo(
    () =>
      tertiaryItems.filter(
        (it) =>
          it.url &&
          !it.hideOn?.includes(isDesktopOrLaptop ? 'desktop' : 'mobile')
      ),
    [tertiaryItems]
  );

  return (
    <>
      <div>
        {visibleSecondaryItems.map(
          ({ label, url, icon }, index) =>
            url && (
              <MenuItem
                key={label + index}
                className={twJoin(
                  'hover:opacity-100 hover:bg-foreground/5 rounded-[4px]',
                  'focus:bg-foreground/5 active:bg-foreground/5'
                )}
              >
                <Link
                  href={url}
                  className="py-1 px-0 hover:text-foreground flex flex-row gap-2 items-center text-foreground font-medium"
                  onClick={() => setIsSecondaryMenuOpen(false)}
                >
                  {icon && (
                    <Image
                      src={icon}
                      width={16}
                      height={16}
                      alt={label}
                      className="dark:invert"
                    />
                  )}
                  {label}
                </Link>
              </MenuItem>
            )
        )}
      </div>
      {!!visibleSecondaryItems.length && !!visibleTertiaryItems.length && (
        <hr className="mx-2 my-2 border-t border-foreground border-opacity-10 bg-transparent " />
      )}
      <div className="mb-4">
        {visibleTertiaryItems.map(
          ({ label, url, external, disabled }, index) =>
            url && (
              <MenuItem
                disabled={disabled}
                className={twJoin(
                  'group rounded-[4px]',
                  'hover:opacity-100 hover:bg-foreground/5',
                  'focus:bg-foreground/5 active:bg-foreground/5'
                )}
                key={`${label}-${index}`}
              >
                {disabled ? (
                  <span
                    className={twJoin(
                      'py-0 px-0 flex flex-row gap-1 items-center',
                      'text-foreground font-medium opacity-50 text-[14px]'
                    )}
                  >
                    {label} <IconLineArrow direction="external" />
                  </span>
                ) : (
                  <Link
                    href={url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className={twJoin(
                      'py-0 px-0 flex flex-row gap-1 items-center',
                      'text-foreground font-medium opacity-50 text-[14px]',
                      'group-hover:opacity-100'
                    )}
                  >
                    {label} <IconLineArrow direction="external" />
                  </Link>
                )}
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
              'hover:opacity-100 hover:bg-foreground/5',
              'focus:bg-foreground/5 active:bg-foreground/5'
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
    </>
  );
};

export default SecondaryMenuItems;
