import { twMerge } from 'tailwind-merge';

export interface ContentFlipperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  flipped?: boolean;
  hover?: boolean;
  focus?: boolean;
  open?: boolean;
  groupHover?: boolean;
  groupFocus?: boolean;
  groupOpen?: boolean;
  animate?: boolean;
  content: React.ReactNode;
  flipContent: React.ReactNode;
}

export function ContentFlipper({
  flipped,
  hover,
  focus,
  open,
  groupHover,
  groupFocus,
  groupOpen,
  animate,
  content,
  flipContent,
  className,
  ...props
}: ContentFlipperProps) {
  return (
    <div
      className={twMerge(
        'group h-4 w-full overflow-hidden',
        '[&>*]:translate-y-0 [&>*]:h-full [&>*]:max-h-full [&>*]:truncate [&>*]:w-full [&>*]:max-w-full',
        flipped && '-translate-y-full',
        hover && 'hover:[&>*]:-translate-y-full',
        focus && 'focus:[&>*]:-translate-y-full',
        open && 'rdx-state-open:[&>*]:-translate-y-full',
        groupHover && 'group-hover:[&>*]:-translate-y-full',
        groupFocus && 'group-focus:[&>*]:-translate-y-full',
        groupOpen && 'group-rdx-state-open:[&>*]:-translate-y-full',
        animate ? '[&>*]:animate-content-flipper-y' : '[&>*]:duration-200',
        className
      )}
      {...props}
    >
      <div>{content}</div>
      <div>{flipContent}</div>
    </div>
  );
}
