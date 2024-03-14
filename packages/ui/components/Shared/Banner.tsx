import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../lib/utilities';
import { IconCircleArrow } from '../Icons/IconCircleArrow';
import { IconWarning } from '../Icons/IconWarning';
import { IconWarningOctagon } from '../Icons/IconWarningOctagon';
import { Button } from '../shadcn/button';
import { IconX } from '../Icons/IconX';

export interface BannerProps extends React.ComponentProps<typeof motion.div> {
  type: 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
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
      className,
      children,
      ...props
    },
    ref
  ) => {
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
          maxHeight: 100,
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
          'flex items-center overflow-hidden justify-between w-full px-2 py-1.5 bg-background border border-border rounded-[4px]',
          type === 'warning' &&
            'text-warning-foreground bg-warning border-warning-border',
          type === 'error' &&
            'text-destructive-foreground bg-destructive bg-opacity-20 border-destructive',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
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
          <motion.span className="leading-none text-xs font-medium">
            {children}
          </motion.span>
        </div>
        <div className="flex items-center gap-2">
          {actionComponent}
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
      </motion.div>
    );
  }
);
