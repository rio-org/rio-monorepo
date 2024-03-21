'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../../lib/utilities';

/////////
// Base
/////////

const Tabs = TabsPrimitive.Root;

/////////
// List
/////////

const tabsListCn = twJoin(
  'inline-flex h-10 items-center justify-center',
  'rounded-md bg-muted p-1 text-muted-foreground'
);
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListCn, className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

////////////
// Trigger
////////////

const tabsTriggerCn = twJoin(
  'inline-flex items-center justify-center',
  'whitespace-nowrap text-sm font-medium',
  'rounded-sm px-3 py-1.5',
  'ring-offset-background transition-all',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm'
);
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerCn, className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

////////////
// Content
////////////

const tabsContentCn = twJoin(
  'mt-2 ring-offset-background',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
);
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentCn, className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
