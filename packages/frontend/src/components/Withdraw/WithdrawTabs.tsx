import Link from 'next/link';
import React from 'react';
import cx from 'classnames';
import { WITHDRAW_NAV_ITEMS } from '../../../config';
import { useRouter } from 'next/router';

const WithdrawTabs = () => {
  const router = useRouter();
  const baseUrlSegment = router.pathname.split('/')[1];
  const urlSegment = router.pathname.split('/')[2];
  const activeTab =
    WITHDRAW_NAV_ITEMS.find((item) => item.slug === urlSegment)?.slug ||
    WITHDRAW_NAV_ITEMS[0].slug;

  return (
    <div className="flex w-full text-center content-center lg:justify-center gap-4">
      {WITHDRAW_NAV_ITEMS.map(({ label, slug }) => (
        <Link
          href={`/${baseUrlSegment}/${slug}`}
          key={slug}
          scroll={false}
          passHref
          className={cx(
            'font-medium hover:text-black ',
            activeTab === slug ? '' : 'text-gray-500 font-bold'
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default WithdrawTabs;
