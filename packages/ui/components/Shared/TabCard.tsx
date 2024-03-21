import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Card } from '../shadcn/card';
import { Tabs, TabsTrigger, TabsList } from '../shadcn/tabs';
import { twJoin } from 'tailwind-merge';
import { cn } from '../../lib/utilities';

interface TabCardProps<T extends string = string>
  extends Omit<React.ComponentProps<typeof Tabs>, 'onValueChange'> {
  tabs: T[];
  onValueChange?: (
    value: T
  ) => void | React.Dispatch<React.SetStateAction<string>>;
  tabDetails?: React.ReactNode | React.ReactNode[];
  cardProps?: React.ComponentProps<typeof Card>;
  tabsTriggerProps?: Omit<React.ComponentProps<typeof TabsTrigger>, 'value'>;
  tabsListProps?: React.ComponentProps<typeof TabsList>;
}

export const TabCard = forwardRef<HTMLDivElement, TabCardProps>(
  (
    {
      tabs,
      className,
      defaultValue,
      value,
      onValueChange,
      tabDetails,
      cardProps,
      tabsTriggerProps,
      tabsListProps,
      children,
      ...props
    },
    ref
  ) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(value || defaultValue || tabs[0]);
    const [height, setHeight] = useState(0);

    if (value && value !== current) {
      setCurrent(value);
    }

    useEffect(() => {
      if (!listRef.current) return;
      const handler = () => setHeight(listRef.current!.clientHeight);
      handler();
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }, [listRef]);

    const handleChange = useCallback((value: string) => {
      setCurrent(value);
      onValueChange?.(value);
    }, []);

    return (
      <Tabs
        ref={ref}
        value={current}
        onValueChange={handleChange}
        className={cn('w-full', className)}
        {...props}
      >
        <div
          className={twJoin(
            'flex items-center flex-col-reverse gap-2 w-full',
            'md:items-end md:flex-row md:gap-0'
          )}
        >
          <TabsList
            ref={listRef}
            {...tabsListProps}
            className={cn(
              'h-[unset] flex items-end gap-0 bg-transparent w-full md:w-[unset] p-0',
              tabsListProps?.className
            )}
          >
            {tabs.map((tab, i) => (
              <Trigger
                key={i}
                tab={tab}
                isActive={current === tab}
                isFirst={!i}
                isLast={i === tabs.length - 1}
                tabsTriggerProps={tabsTriggerProps}
              />
            ))}
          </TabsList>
          <div className="flex flex-col items-end justify-end shrink-0 w-full md:shrink">
            <div
              className="flex justify-end items-center px-3 w-full"
              style={{ height: height ? Math.max(0, height - 7) : undefined }}
            >
              {tabDetails}
            </div>
            <Spacer className="hidden md:block w-full rounded-tr-[4px] border-r shadow-cardlight" />
          </div>
        </div>
        <Card
          {...cardProps}
          className={cn(
            'w-full relative rounded-t-none rounded-b-[4px] border-t-0 space-y-4',
            cardProps?.className
          )}
        >
          {children}
        </Card>
      </Tabs>
    );
  }
);
TabCard.displayName = 'TabCard';

function Spacer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-background h-[5px] w-full border-t border-border',
        className
      )}
    />
  );
}

const tabsTriggerBaseCn = twJoin(
  'bg-foreground bg-opacity-[0.03] border-t border-l border-r border-transparent',
  'text-foreground text-opacity-40 text-base text-medium px-4 py-[9px]',
  'shadow-cardinactive rounded-b-none rounded-t-[4px]',
  'data-[state=active]:border-border data-[state=active]:text-opacity-100',
  'data-[state=active]:bg-background data-[state=active]:bg-opacity-100',
  'data-[state=active]:!shadow-cardlight'
);

function Trigger({
  tab,
  isActive,
  isFirst,
  isLast,
  tabsTriggerProps
}: {
  tab: string;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  tabsTriggerProps?: TabCardProps['tabsTriggerProps'];
}) {
  return (
    <>
      <div className="flex flex-col flex-1">
        <TabsTrigger
          value={tab}
          {...tabsTriggerProps}
          className={cn(
            tabsTriggerBaseCn,
            isActive && '[&+div]:border-t-transparent',
            tabsTriggerProps?.className
          )}
        >
          {tab}
        </TabsTrigger>
        <Spacer
          className={twJoin(
            'transition-all md:border-r-0',
            isFirst && 'border-l',
            isLast && 'border-r'
          )}
        />
      </div>
      {!isLast && <Spacer className="w-1 min-w-1 max-w-1" />}
    </>
  );
}
