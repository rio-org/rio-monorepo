import { Tabs, Tab, TabsHeader, Drawer } from '@material-tailwind/react';
import Link from 'next/link';
import React, { useRef } from 'react';
import { APP_NAV_ITEMS } from '../../../config';
import { useRouter } from 'next/router';
import cx from 'classnames';
import SecondaryMenu from './SecondaryMenu';
import SecondaryMenuItems from './SecondaryMenuItems';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';

const slugUrl = (slug: string) => {
  if (slug === '/') return '/';
  return `/${slug}`;
};

const MobileNav = () => {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = React.useState(false);
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const activeTab =
    APP_NAV_ITEMS.find((item) => baseUrlSegment.includes(item.slug))?.slug ||
    APP_NAV_ITEMS[0].slug;
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const drawerContentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="fixed bottom-0 lg:hidden bg-[var(--color-app-bg)] px-3 py-5 w-full justify-around items-center border-t border-t-[var(--color-element-wrapper-bg)]">
        <Tabs value={activeTab} className="p-2">
          <TabsHeader className="justify-around p-0">
            {APP_NAV_ITEMS.map(({ label, slug }, index) => (
              <Link
                href={slugUrl(slug)}
                key={label + index}
                scroll={false}
                className={cx(
                  'font-medium  rounded-xl hover:text-black hover:bg-[var(--color-element-wrapper-bg)]',
                  activeTab === slug ? 'text-black' : 'text-gray-500'
                )}
              >
                <Tab
                  key={label + index}
                  value={slug}
                  className={cx(
                    'py-2 px-4 font-medium  rounded-xl hover:text-black hover:bg-[var(--color-element-wrapper-bg)]',
                    activeTab === slug ? 'text-black' : 'text-gray-500'
                  )}
                >
                  {label}
                </Tab>
              </Link>
            ))}
            <SecondaryMenu
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
          <SecondaryMenuItems setIsSecondaryMenuOpen={setIsSecondaryMenuOpen} />
        </div>
      </Drawer>
    </>
  );
};

export default MobileNav;
