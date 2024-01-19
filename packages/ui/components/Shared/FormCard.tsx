import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

import type { InternalAppNavItem } from '../../lib/typings';
import { buildUrlFromSegments, cn } from '../../lib/utilities';

type FormCardContainerProps = {
  title: React.ReactNode | React.ReactNode[];
  header: React.ReactNode | React.ReactNode[];
  children: React.ReactNode;
  noPadding?: boolean;
};

const Container = ({
  title,
  header,
  children,
  noPadding
}: FormCardContainerProps) => {
  return (
    <div className="min-h-[inherit] w-full flex justify-center items-start">
      <div className="w-full lg:max-w-[588px]">
        <h1 className="text-2xl mb-2 font-medium hidden lg:block">{title}</h1>
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-[2px]">
          <div className="flex flex-col justify-start lg:flex-row lg:justify-between gap-2 lg:gap-8 w-full px-4 lg:px-5 pt-3 lg:pt-5 pb-3">
            <h1 className="text-2xl mb-0 font-medium lg:hidden">{title}</h1>
            <div className="flex gap-2 justify-center items-center">
              {header}
            </div>
          </div>
          <motion.div
            className={cn(
              'bg-white rounded-xl w-full m-[2px] flex flex-col gap-4',
              noPadding ? '' : ' p-4 lg:p-6'
            )}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export interface TabsProps {
  items: InternalAppNavItem[];
}

const Tabs = ({ items }: TabsProps) => {
  const router = useRouter();
  const [, ...baseUrlSegment] = router.pathname.split('/');
  const urlSegment = baseUrlSegment.splice(-1)[0];
  const activeTab =
    items.find((item) => new RegExp(`^${item.slug}$`, 'i').test(urlSegment)) ||
    items[0].slug;

  return (
    <div className="flex w-full text-center content-center lg:justify-center gap-4">
      {items.map(({ label, slug }) => (
        <Link
          href={buildUrlFromSegments(baseUrlSegment, slug)}
          key={slug}
          scroll={false}
          passHref
          className={cn(
            'font-medium hover:text-black ',
            activeTab === slug && 'text-gray-500 font-bold'
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default {
  Container,
  Tabs
};
