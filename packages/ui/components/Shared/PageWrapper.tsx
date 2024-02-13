import { cn } from '../../lib/utilities';

type Props = React.ComponentProps<'div'> & {
  isWide?: boolean;
};

export const PageWrapper = ({ children, isWide, className }: Props) => {
  const maxWidthClass = isWide ? `sm:max-w-[1024px]` : 'lg:max-w-[588px]';
  return (
    <div
      className={cn(
        'h-full w-full flex items-center justify-center',
        className
      )}
    >
      <div className={`w-full ${maxWidthClass}`}>{children}</div>
    </div>
  );
};
