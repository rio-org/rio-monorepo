import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIsMounted } from '../../hooks/useIsMounted';
import { DESKTOP_MQ } from '../../lib/constants';
import { cn } from '../../lib/utilities';
import Skeleton from 'react-loading-skeleton';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  suffix?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
};

const InputField = forwardRef<HTMLInputElement, Props>(
  (
    {
      title,
      className,
      style,
      onFocus,
      suffix,
      onBlur,
      autoFocus,
      children,
      ...inputProps
    },
    forwardRef
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isMounted = useIsMounted();
    const isDesktopOrLaptop = useMediaQuery({
      query: DESKTOP_MQ
    });

    const ref = (forwardRef ?? inputRef) as typeof inputRef;

    const focusInput = useCallback(() => {
      if (!ref.current) return;
      ref.current.focus();
      setIsFocused(true);
    }, [ref, inputRef]);

    return (
      <label
        className={cn('w-full block hover:cursor-text', className)}
        onClick={() => isDesktopOrLaptop && focusInput()}
        style={style}
      >
        {title && <span className="mb-1 font-medium block">{title}</span>}
        <div
          className={cn(
            'bg-input text-foreground px-4 md:px-[20px] py-4 rounded-xl border border-transparent hover:border-border',
            isFocused && 'border-border hover:border-border'
          )}
        >
          <div
            className="flex flex-row gap-4"
            style={{
              // required to allow mobile asset selector to act as a drawer
              position: isMounted && isDesktopOrLaptop ? 'relative' : 'inherit'
            }}
          >
            {isMounted ? (
              <input
                // eslint-disable-next-line
                // @ts-ignore
                ref={inputRef}
                className="text-[22px] bg-transparent w-full focus:outline-none flex-1"
                autoFocus={!!isDesktopOrLaptop && autoFocus}
                onFocus={(e) => (setIsFocused(true), onFocus?.(e))}
                onBlur={(e) => (setIsFocused(false), onBlur?.(e))}
                {...inputProps}
              />
            ) : (
              <div className="w-full flex-1">
                <Skeleton width={50} height={26} />
              </div>
            )}
            {suffix}
          </div>
          {children}
        </div>
      </label>
    );
  }
);
InputField.displayName = 'InputField';

export default InputField;
