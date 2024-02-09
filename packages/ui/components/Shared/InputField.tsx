import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIsMounted } from '../../hooks/useIsMounted';
import { DESKTOP_MQ } from '../../lib/constants';
import { cn } from '../../lib/utilities';

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
            'bg-[#f4f4f4] text-black px-4 lg:px-[20px] py-4 rounded-xl border border-transparent hover:border-gray-300',
            isFocused && 'border-gray-400 hover:border-gray-400'
          )}
        >
          <div
            className="flex flex-row gap-4"
            style={{
              // required to allow mobile asset selector to act as a drawer
              position: isMounted && isDesktopOrLaptop ? 'relative' : 'inherit'
            }}
          >
            <input
              // eslint-disable-next-line
              // @ts-ignore
              ref={inputRef}
              className="text-[22px] bg-transparent w-full focus:outline-none flex-1"
              autoFocus={isMounted && !!isDesktopOrLaptop && autoFocus}
              onFocus={(e) => (setIsFocused(true), onFocus?.(e))}
              onBlur={(e) => (setIsFocused(false), onBlur?.(e))}
              {...inputProps}
            />
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
