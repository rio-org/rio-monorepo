import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { cn } from '../../lib/utilities';
import { IconCopy } from '../Icons/IconCopy';

export interface MonospaceBoxProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'children'> {
  /**
   * A React node that will render within it.
   * Will override the "value" prop in the UI if provided.
   */
  children?: React.HTMLProps<HTMLDivElement>['children'];
  /**
   * The "value" of the MonospaceBox.
   * If `children` are not provided for the component, `value` will be shown in the UI.
   * If `copyable` is true, then this value will be copied to the clipboard when the user clicks on the MonospaceBox.
   */
  value?: string | number;
  /**
   * If true, the `value` of the MonospaceBox will be copyable.
   */
  copyable?: boolean;
}

export function MonospaceBox({
  className,
  value,
  copyable,
  children,
  ...props
}: MonospaceBoxProps) {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!copySuccess) return;
    const id = setTimeout(() => setCopySuccess(false), 1000);
    return () => clearTimeout(id);
  }, [copySuccess]);

  return (
    <div
      className={cn(
        twJoin(
          'flex items-center justify-between',
          'px-3 py-3 rounded-lg bg-gray-200 bg-opacity-50',
          'font-mono'
        ),
        className
      )}
      {...props}
    >
      {children ?? (
        <span
          className={cn(
            'max-w-full whitespace-nowrap text-ellipsis overflow-hidden',
            copyable && 'max-w-[calc(100%-1.5rem)]'
          )}
        >
          {value}
        </span>
      )}

      {copyable && typeof value !== 'undefined' && (
        <button
          className="relative w-3 h-3 min-w-3 min-h-3"
          onClick={() => {
            setCopySuccess(true);
            navigator.clipboard
              .writeText(value.toString())
              .catch(console.error);
          }}
        >
          <IconCopy />
          <AnimatePresence>
            {copySuccess && (
              <motion.div
                initial={{ opacity: 0, x: '-100%', y: '-50%' }}
                animate={{ opacity: 1, x: '-115%', y: '-50%' }}
                exit={{ opacity: 0, x: '-100%', y: '-50%' }}
                className={twJoin(
                  'absolute top-1/2 left-0',
                  'py-1 px-2',
                  'text-xs font-semibold',
                  'bg-white rounded-md border border-gray-300'
                )}
              >
                Copied
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}
