import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';
import { useIsMounted } from '../../hooks/useIsMounted';
import { DESKTOP_MQ } from '../../lib/constants';
import { cn } from '../../lib/utilities';

type Props = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  suffix?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  textAreaClassName?: string;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      title,
      className,
      style,
      onChange,
      onFocus,
      suffix,
      onBlur,
      autoFocus,
      children,
      textAreaClassName,
      ...textareaProps
    },
    forwardRef
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const isMounted = useIsMounted();
    const [inputHeight, setInputHeight] = useState(0);
    const isDesktopOrLaptop = useMediaQuery({
      query: DESKTOP_MQ
    });

    const ref = (forwardRef ?? inputRef) as typeof inputRef;

    const focusInput = useCallback(() => {
      if (!ref.current) return;
      ref.current.focus();
      setIsFocused(true);
    }, [ref, inputRef]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputHeight(e.target.scrollHeight ?? 0);
        onChange?.(e);
      },
      [onChange]
    );

    return (
      <label
        className={cn('w-full block hover:cursor-text', className)}
        onClick={() => isDesktopOrLaptop && focusInput()}
        onFocus={focusInput}
        tabIndex={0}
        style={style}
      >
        {title && <span className="mb-1 font-medium block">{title}</span>}
        <div
          className={cn(
            'bg-input text-foreground px-4 lg:px-[20px] py-4 rounded-xl border border-transparent hover:border-border',
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
            <motion.textarea
              // eslint-disable-next-line
              // @ts-ignore
              ref={inputRef}
              className={cn(
                'bg-transparent w-full !outline-none flex-1',
                textAreaClassName
              )}
              autoFocus={isMounted ? autoFocus ?? isDesktopOrLaptop : false}
              onFocus={(e) => (setIsFocused(true), onFocus?.(e))}
              onBlur={(e) => (setIsFocused(false), onBlur?.(e))}
              onChange={handleChange}
              style={{
                height: inputHeight
              }}
              {...textareaProps}
            />
            {suffix}
          </div>
          {children}
        </div>
      </label>
    );
  }
);
TextAreaField.displayName = 'TextAreaField';

export default TextAreaField;
