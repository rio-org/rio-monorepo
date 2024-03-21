import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { InfoTooltip, type InfoTooltipProps } from './InfoTooltip';
import { useIsTouch } from '../../contexts/TouchProvider';
import { cn } from '../../lib/utilities';

export const InfoBadge = ({
  children,
  className,
  title,
  icon,
  infoTooltipContent
}: {
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  suffix?: string;
  infoTooltipContent?: InfoTooltipProps['children'];
}) => {
  const isTouch = useIsTouch();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'text-foreground text-[14px] tracking-tight',
        className
      )}
    >
      <span className="inline-flex items-center opacity-50 gap-1 uppercase leading-none font-mono">
        {icon}
        <span>{title}</span>
      </span>
      {children ? (
        <AnimatePresence>
          <motion.span
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            className="whitespace-nowrap uppercase leading-none font-mono"
          >
            {children}
          </motion.span>
        </AnimatePresence>
      ) : (
        <Skeleton
          width={40}
          containerClassName="!bg-foreground !bg-opacity-20 rounded-[4px] overflow-hidden"
          className="!opacity-50 after:!opacity-10"
        />
      )}
      {children && infoTooltipContent && (
        <AnimatePresence>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 13, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-[14px] inline"
          >
            <InfoTooltip
              iconClassName="[&>path]:stroke-foreground opacity-40 w-[14px] h-[14px] -translate-y-[1px] ml-0.5"
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
