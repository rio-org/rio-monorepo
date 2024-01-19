import { Tabs, Tab, TabsHeader, Drawer } from '@material-tailwind/react';
import Link from 'next/link';
import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import SecondaryMenu from './SecondaryMenu';
import SecondaryMenuItems from './SecondaryMenuItems';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { InternalAppNavItem, NavItem, SocialNavItem } from '../../lib/typings';

const slugUrl = (slug: string) => {
  if (slug === '/') return '/';
  return `/${slug}`;
};

const MobileNav = ({
  items,
  secondaryItems,
  tertiaryItems,
  socialItems
}: {
  items: InternalAppNavItem[];
  secondaryItems: NavItem[];
  tertiaryItems: NavItem[];
  socialItems: SocialNavItem[];
}) => {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = React.useState(false);
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const activeTab =
    items.find((item) => baseUrlSegment.includes(item.slug))?.slug ||
    items[0].slug;
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const drawerContentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="fixed bottom-0 lg:hidden bg-[var(--color-app-bg)] px-3 py-4 w-full justify-around items-center border-t border-t-[var(--color-element-wrapper-bg)]">
        <Tabs value={activeTab} className="p-2 duration-100">
          <TabsHeader className="justify-around p-0 duration-100">
            {items.map(({ label, slug }, index) => (
              <Link
                href={slugUrl(slug)}
                key={label + index}
                scroll={false}
                className={cx(
                  'font-medium  rounded-full hover:text-black hover:bg-[var(--color-element-wrapper-bg)]',
                  activeTab === slug ? 'text-black' : 'text-gray-500'
                )}
              >
                <Tab
                  key={label + index}
                  value={slug}
                  className={cx(
                    'py-2 px-4 font-medium  hover:text-black hover:bg-[var(--color-element-wrapper-bg)] rounded-full',
                    activeTab === slug ? 'text-black' : 'text-gray-500'
                  )}
                >
                  {label}
                </Tab>
              </Link>
            ))}
            <SecondaryMenu
              secondaryItems={secondaryItems}
              tertiaryItems={tertiaryItems}
              socialItems={socialItems}
              isSecondaryMenuOpen={isSecondaryMenuOpen}
              setIsSecondaryMenuOpen={setIsSecondaryMenuOpen}
            />
          </TabsHeader>
        </Tabs>
      </div>
      <Drawer
        placement="bottom"
        size={drawerContentRef.current?.offsetHeight}
        open={!isDesktopOrLaptop && isSecondaryMenuOpen}
        onClose={() => !isDesktopOrLaptop && setIsSecondaryMenuOpen(false)}
        className="rounded-t-2xl"
      >
        <div ref={drawerContentRef} className="p-2">
          <SecondaryMenuItems
            secondaryItems={secondaryItems}
            tertiaryItems={tertiaryItems}
            socialItems={socialItems}
            setIsSecondaryMenuOpen={setIsSecondaryMenuOpen}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MobileNav;
