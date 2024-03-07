import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { InfoTooltip, type InfoTooltipProps } from './InfoTooltip';
import { useIsTouch } from '../../contexts/TouchProvider';
import { cn } from '../../lib/utilities';

export const InfoBadge = ({
  children,
  className,
  prefix,
  suffix,
  infoTooltipContent
}: {
  className?: string;
  children?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  infoTooltipContent?: InfoTooltipProps['children'];
}) => {
  const isTouch = useIsTouch();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'text-rio-blue text-xs leading-none tracking-tight',
        'py-1.5 px-3.5',
        'rounded-full border border-[var(--color-light-blue)]',
        '[&>span]:inline-block [&>span]:uppercase [&>span]:leading-none [&>span]:font-mono',
        className
      )}
    >
      {prefix && <span>{prefix}</span>}
      {children ? (
        <AnimatePresence>
          <motion.span
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            className="whitespace-nowrap"
          >
            {children}
          </motion.span>
        </AnimatePresence>
      ) : (
        <Skeleton
          width={40}
          containerClassName="!bg-rio-blue !bg-opacity-20 rounded-[4px] overflow-hidden"
          className="!opacity-70 after:!opacity-10"
        />
      )}
      {suffix && <span>{suffix}</span>}
      {children && infoTooltipContent && (
        <AnimatePresence>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 12, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-3 inline"
          >
            <InfoTooltip
              iconClassName="[&>path]:stroke-[blue] opacity-60 w-[12px] h-[12px] -translate-y-[1px] ml-0.5"
              contentClassName="max-w-[300px]"
              align="center"
              side={isTouch ? 'bottom' : 'top'}
            >
              {infoTooltipContent}
            </InfoTooltip>
          </motion.div>
        </AnimatePresence>
      )}
    </span>
  );
};
