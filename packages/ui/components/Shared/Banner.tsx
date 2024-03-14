import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { cn } from '../../lib/utilities';
import { IconCircleArrow } from '../Icons/IconCircleArrow';
import { IconWarning } from '../Icons/IconWarning';
import { IconWarningOctagon } from '../Icons/IconWarningOctagon';
import { Button } from '../shadcn/button';
import { IconX } from '../Icons/IconX';
import { IconOpenAccordion } from '../Icons/IconOpenAccordion';

export interface BannerProps extends React.ComponentProps<typeof motion.div> {
  type?: 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
  title: string;
  accordion?: boolean;
  handler?: (
    isOpen?: boolean
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
  actionComponent?: React.ReactNode;
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      type = 'info',
      icon,
      handler,
      actionComponent,
      accordion = false,
      className,
      title,
      children,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(!accordion);
    return (
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          maxHeight: 0,
          y: 20,
          marginBottom: 0
        }}
        animate={{
          opacity: 1,
          maxHeight: 1000,
          y: 0,
          marginBottom: 16
        }}
        exit={{
          opacity: 0,
          maxHeight: 0,
          y: 20,
          marginBottom: 0
        }}
        className={cn(
          'flex flex-col overflow-hidden w-full px-2 py-1.5 bg-background border border-border rounded-[4px]',
          type === 'warning' &&
            'text-warning-foreground bg-warning border-warning-border',
          type === 'error' &&
            'text-destructive-foreground bg-destructive bg-opacity-20 border-destructive',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              {icon ??
                (() => {
                  switch (type) {
                    case 'warning':
                      return (
                        <IconWarning
                          height={16}
                          width={16}
                          className="[&>path]:stroke-warning-foreground"
                        />
                      );
                    case 'error':
                      return (
                        <IconWarningOctagon
                          height={16}
                          width={16}
                          className="[&>path]:stroke-destructive"
                        />
                      );
                    case 'info':
                    default:
                      return (
                        <IconCircleArrow
                          direction="right"
                          height={16}
                          width={16}
                          className="[&>path]:stroke-foreground"
                        />
                      );
                  }
                })()}
            </div>
            <motion.span className="leading-none text-xs font-bold">
              {title}
            </motion.span>
          </div>
          <div className="flex justify-end items-center gap-2">
            {actionComponent}
            {accordion && (
              <Button
                variant="link"
                className={cn(
                  'flex items-center font-bold text-xs py-0 h-[unset] px-0 gap-1 leading-none',
                  type === 'warning' && 'text-warning-foreground',
                  type === 'error' && 'text-destructive'
                )}
                onClick={() => setExpanded((ex) => !ex)}
              >
                <span>Details</span>
                <IconOpenAccordion
                  expanded={expanded}
                  className={cn(
                    'w-3 h-3 [&>path]:fill-foreground',
                    type === 'warning' && '[&>path]:fill-warning-foreground',
                    type === 'error' && '[&>path]:fill-destructive'
                  )}
                />
              </Button>
            )}
            {handler && (
              <Button
                variant="link"
                className="no-underline flex items-center justify-center py-0 h-[unset] px-0"
                onClick={() => handler(false)}
              >
                <IconX height={16} width={16} className="stroke-foreground" />
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {expanded && children && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 0.8, height: 'auto', marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className={cn('w-full overflow-hidden text-xs font-light')}
            >
              {children}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);
