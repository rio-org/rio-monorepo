import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

import type { InternalAppNavItem } from '../../lib/typings';
import { buildUrlFromSegments, cn } from '../../lib/utilities';
import { twMerge } from 'tailwind-merge';

type FormCardContainerProps = {
  title?: React.ReactNode | React.ReactNode[];
  header?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
};

const Wrapper = ({
  title,
  header,
  className,
  children
}: Omit<FormCardContainerProps, 'noPadding'>) => (
  <div
    className={cn(
      'min-h-[inherit] w-full flex justify-center items-start',
      className
    )}
  >
    <div className="w-full lg:max-w-[588px]">
      {title && (
        <h1 className="text-2xl mb-2 font-medium hidden lg:block">{title}</h1>
      )}
      <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-[16px] p-1">
        <div
          className={twMerge(
            'flex flex-col lg:flex-row justify-start lg:justify-between',
            'w-full px-4 lg:px-5 lg-max:gap-2 lg-max:pt-3 lg-max:pb-3',
            !!header && 'lg:gap-8 lg:pt-3 pb-3'
          )}
        >
          {title && (
            <h1 className="text-2xl mb-0 font-medium lg:hidden">{title}</h1>
          )}
          {header && (
            <div className="flex gap-2 justify-start font-bold items-center w-full">
              {header}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">{children}</div>
      </div>
    </div>
  </div>
);

const Body = ({
  noPadding,
  className,
  children
}: Pick<FormCardContainerProps, 'children' | 'noPadding' | 'className'>) => (
  <motion.div
    className={cn(
      'bg-white rounded-[14px] w-full flex flex-col gap-4',
      noPadding ? '' : ' p-4 lg:p-6',
      className
    )}
  >
    {children}
  </motion.div>
);

const Container = ({
  title,
  header,
  children,
  className,
  noPadding
}: FormCardContainerProps) => {
  return (
    <Wrapper title={title} header={header} className={className}>
      <Body noPadding={noPadding}>{children}</Body>
    </Wrapper>
  );
};

export interface TabsProps {
  baseUrl: string;
  items: InternalAppNavItem[];
}

const Tabs = ({ items, baseUrl }: TabsProps) => {
  const router = useRouter();
  const urlSegment = router.pathname.replace(new RegExp(`${baseUrl}/`), '');
  const activeTab = (
    items.find((item) => new RegExp(`^${item.slug}$`, 'i').test(urlSegment)) ||
    items[0]
  ).slug;

  return (
    <div className="flex w-full text-center content-center text-gray-600 gap-4">
      {items.map(({ label, slug }) => {
        const className = cn(
          'font-medium',
          activeTab === slug && 'text-black font-bold'
        );

        if (slug === activeTab) {
          return (
            <span key={slug} className={cn(className, 'cursor-default')}>
              {label}
            </span>
          );
        }

        return (
          <Link
            href={buildUrlFromSegments(baseUrl, slug)}
            key={slug}
            scroll={false}
            passHref
            aria-disabled={slug === activeTab}
            className={cn(className, 'hover:text-black')}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default {
  Container,
  Tabs,
  Wrapper,
  Body
};
