import React from 'react';
import { cn } from '../../lib/utilities';
import { Card } from '../shadcn/card';

interface DetailBoxProps
  extends Omit<React.ComponentProps<typeof Card>, 'title'> {
  title: React.ReactNode | React.ReactNode[] | string;
  direction?: 'row' | 'column';
}

export const DetailBox = React.forwardRef<HTMLDivElement, DetailBoxProps>(
  ({ title, className, direction, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        'flex items-center gap-3 shadow-none flex-grow flex-shrink-0',
        'flex-row justify-between py-[14px] px-[20px]',
        'md:flex-col md:justify-center',
        direction === 'column' && 'flex-col justify-center',
        direction === 'row' && 'md:flex-row md:justify-between',
        className
      )}
      {...props}
    >
      <Content className="text-[14px] text-opacity-50 font-bold">
        {title}
      </Content>
      <Content className="text-base text-opacity-80 font-mono">
        {props.children}
      </Content>
    </Card>
  )
);
DetailBox.displayName = 'DetailBox';

function Content({
  children,
  className
}: {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <div
      className={cn(
        'flex justify-center items-center max-w-full gap-2 text-foreground leading-none',
        className
      )}
    >
      {children}
    </div>
  );
}
