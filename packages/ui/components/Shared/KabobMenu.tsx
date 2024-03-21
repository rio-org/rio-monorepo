import {
  Menu,
  MenuHandler,
  MenuList,
  MenuProps,
  MenuItem
} from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { twJoin } from 'tailwind-merge';
import { IconX } from '../Icons/IconX';
import { IconKabob } from '../Icons/IconKabob';
import { cn } from '../../lib/utilities';

export function KabobMenu({
  title,
  placement = 'bottom-end',
  handlerButtonClassName,
  menuListClassName,
  menuContentClassName,
  animate = true,
  children,
  ...props
}: MenuProps & {
  title: string | React.ReactNode;
  handlerButtonClassName?: string;
  menuListClassName?: string;
  menuContentClassName?: string;
  animate?: boolean;
}) {
  useEffect(() => {
    if (!props.open || !props.handler) return;
    const closeOnScroll = () => props.handler?.(false);
    const main = document.getElementsByTagName('main')[0];
    main?.addEventListener('scroll', closeOnScroll);
    return () => main.removeEventListener('scroll', closeOnScroll);
  }, [props.handler, props.open]);

  return (
    <Menu placement={placement} {...props}>
      <MenuHandler>
        <button
          className={cn(
            'flex items-center justify-center w-6 h-6 min-w-6 min-h-6',
            handlerButtonClassName
          )}
        >
          <IconKabob />
        </button>
      </MenuHandler>
      <MenuList
        className={cn(
          'relative bg-background border-0 text-foreground',
          '!-translate-y-8 !translate-x-1',
          'before:bg-foregroundA2 before:absolute before:inset-0 before:-z-[1]',
          menuListClassName
        )}
      >
        <div className="flex items-center justify-between w-full p-1">
          {typeof title === 'string' ? (
            <span className="text-sm font-semibold">{title}</span>
          ) : (
            title
          )}

          {props.handler && (
            <button
              className={twJoin(
                'flex items-center justify-center',
                'w-4 h-4 min-w-4 min-h-4',
                'opacity-40 hover:opacity-100 transition-opacity'
              )}
              onClick={() => props.handler?.(false)}
            >
              <IconX
                height={16}
                width={16}
                strokeWidth={2}
                className="[&>path]:stroke-current"
              />
            </button>
          )}
        </div>
        <AnimatePresence>
          {(props.open || !animate) && (
            <motion.div
              initial={!animate ? undefined : { height: 0, opacity: 0 }}
              animate={!animate ? undefined : { height: 'auto', opacity: 1 }}
              exit={!animate ? undefined : { height: 0, opacity: 0 }}
              transition={!animate ? undefined : { duration: 0.1, delay: 0.05 }}
              className={cn(
                'bg-background rounded-lg overflow-hidden py-1 px-1 gap-0.5',
                menuContentClassName
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </MenuList>
    </Menu>
  );
}

export function KabobMenuItem({
  className,
  ...props
}: Parameters<typeof MenuItem>[0]) {
  return (
    <MenuItem
      className={cn(
        'flex items-center gap-1.5 px-2 py-2 hover:bg-foregroundA1',
        className
      )}
      {...props}
    />
  );
}
