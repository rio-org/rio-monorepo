import React, { useCallback, useState } from 'react';
import { asError, asType, cn } from '@rio-monorepo/ui/lib/utilities';
import TextAreaField from '@rio-monorepo/ui/components/Shared/TextAreaField';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  validation: (str: string) => boolean;
  isOperator?: boolean;
};

const SubmitterField = ({
  value,
  onChange,
  validation,
  disabled,
  onBlur,
  readOnly,
  isOperator,
  ...props
}: Props) => {
  const [status, setStatus] = useState<{
    value: 'unknown' | 'valid' | 'invalid' | 'loading';
    message?: string;
  }>({ value: 'unknown' });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      try {
        validation(asType<string>(e.target.value));
        setStatus({ value: 'valid' });
      } catch (e) {
        // set validation if correct but only set validation errors on blur
      } finally {
        onChange?.(e);
      }
    },
    []
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    try {
      if (!e.target.value) throw new Error('Keys cannot be empty');
      validation(asType<string>(e.target.value));
      setStatus({ value: 'valid' });
    } catch (e) {
      setStatus({ value: 'invalid', message: asError(e).message });
    } finally {
      onBlur?.(e);
    }
  }, []);

  return (
    <div>
      <TextAreaField
        title="Keys"
        className={cn(
          '[&>div]:first-of-type:px-0 [&>div]:first-of-type:py-0',
          'relative z-10',
          (isOperator === false || status.value === 'invalid') &&
            '[&_*]:!border-red-500'
        )}
        textAreaClassName={cn(
          'min-h-[80px] max-h-[200px] !p-4',
          '!font-mono !text-sm !leading-snug',
          'transition-all',
          disabled && 'opacity-30'
        )}
        placeholder="Paste your key file contents here"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
      <AnimatePresence>
        {(isOperator === false || status.message) && (
          <motion.div
            initial={{ opacity: 1, translateY: -64, maxHeight: 0 }}
            animate={{ opacity: 1, translateY: -8, maxHeight: 90 }}
            exit={{ opacity: 0, translateY: -64, maxHeight: 0 }}
            className={twJoin(
              'relative -z-1 w-full rounded-b-xl bg-red-100 bg-opacity-25 overflow-hidden',
              'text-red-500 text-sm w-full h-full max-h-full px-3 pb-3 pt-4 overflow-hidden line-clamp-3'
            )}
          >
            <div className="w-full max-h-[90px-1.75rem] overflow-hidden line-clamp-3">
              {isOperator === false
                ? 'You cannot submit operator keys as your wallet address is not registered as an operator manager.'
                : status.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmitterField;
