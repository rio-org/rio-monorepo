// import { Tabs, Tab } from '@mui/material'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Tabs, TabsHeader, Tab } from '@material-tailwind/react';
import cx from 'classnames';
import { APP_NAV_ITEMS } from '../../../config';

const AppNav = () => {
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const activeTab =
    APP_NAV_ITEMS.find((item) => baseUrlSegment.includes(item.slug))?.slug ||
    APP_NAV_ITEMS[0].slug;

  return (
    <div className="flex w-full text-center content-center justify-center">
      <Tabs value={activeTab}>
        <TabsHeader className="rounded-[16px] bg-black bg-opacity-5 p-[2px]">
          {APP_NAV_ITEMS.map(({ label, slug }) => (
            <Link href={slug} key={slug} passHref>
              <Tab
                value={slug}
                key={slug}
                className={cx(
                  'py-2 px-4 font-medium hover:text-black',
                  activeTab === slug ? '' : 'text-gray-500'
                )}
                aria-label={label}
              >
                {label}
              </Tab>
            </Link>
          ))}
        </TabsHeader>
      </Tabs>
    </div>
  );
};

export default AppNav;
