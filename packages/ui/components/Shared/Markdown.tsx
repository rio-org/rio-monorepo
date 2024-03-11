import { twJoin } from 'tailwind-merge';
import ReactMarkdown, {
  Options as ReactMarkdownProps,
  Components
} from 'react-markdown';
import IconExternal from '../Icons/IconExternal';
import { cn } from '../../lib/utilities';

export interface MarkdownProps extends ReactMarkdownProps {
  componentClassNames?: Record<keyof Components, string>;
}

export function Markdown({
  components,
  className,
  componentClassNames: cns,
  ...props
}: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn(
        'pt-4 pb-4 px-2 space-y-4 font-sans text-sm opacity-80',
        '[&_h1,&_h2,&_h3,&_h4,&_h5,&_h6,&_strong]:font-bold',
        '[&&_a]:font-semibold [&_h6]:font-bold [&_h3]:font-bold [&_h4]:font-bold',
        className
      )}
      components={{
        h1({ className, ...rest }) {
          return (
            <h2 className={cn(className, 'text-2xl', cns?.h1)} {...rest} />
          );
        },
        h2({ className, ...rest }) {
          return <h3 className={cn(className, 'text-xl', cns?.h2)} {...rest} />;
        },
        h3({ className, ...rest }) {
          return <h4 className={cn(className, 'text-lg', cns?.h3)} {...rest} />;
        },
        h4({ className, ...rest }) {
          return (
            <h4
              className={cn(className, 'text-[inherit]', cns?.h4)}
              {...rest}
            />
          );
        },
        h5({ className, ...rest }) {
          return (
            <h4
              className={cn(className, 'text-[inherit]', cns?.h5)}
              {...rest}
            />
          );
        },
        ul({ className, ...rest }) {
          return (
            <ul
              className={cn(
                className,
                'list-disc list-inside leading-relaxed space-y-0.5',
                cns?.ul
              )}
              {...rest}
            />
          );
        },
        ol({ className, ...rest }) {
          return (
            <ol
              className={cn(
                className,
                'list-decimal list-inside leading-relaxed space-y-0.5',
                cns?.ol
              )}
              {...rest}
            />
          );
        },
        p({ className, ...rest }) {
          return (
            <p className={cn(className, 'leading-[1.7]', cns?.p)} {...rest} />
          );
        },
        a({ children, className, href, ...rest }) {
          delete rest.target;
          delete rest.rel;
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(className, 'underline whitespace-nowrap', cns?.a)}
              {...rest}
            >
              <span>{children}</span>
              <IconExternal
                className={twJoin(
                  'inline mx-1 w-[10px] h-[10px]',
                  '[&>path]:stroke-2 -translate-y-0.5'
                )}
              />
            </a>
          );
        },
        ...components
      }}
      {...props}
    />
  );
}
