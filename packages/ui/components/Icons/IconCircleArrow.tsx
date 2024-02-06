import React from 'react';
import { cn } from '../../lib/utilities';

type Props = React.ComponentProps<'svg'> & {
  direction: 'up' | 'down' | 'left' | 'right' | 'external';
};

export function IconCircleArrow({
  direction = 'up',
  className,
  ...props
}: Props) {
  const rotation = (direction: string) => {
    switch (direction) {
      case 'up':
        return 0;
      case 'right':
        return 90;
      case 'down':
        return 180;
      case 'left':
        return 270;
      case 'external':
        return -45;
      default:
        return 0;
    }
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={`rotate(${rotation(direction)})`}
      className={cn('[&>path]:stroke-gray-500', className)}
      {...props}
    >
      <path
        d="M10.6668 7.99967L8.00016 5.33301M8.00016 5.33301L5.3335 7.99967M8.00016 5.33301L8.00016 10.6663M14.6668 7.99967C14.6668 11.6816 11.6821 14.6663 8.00016 14.6663C4.31826 14.6663 1.3335 11.6816 1.3335 7.99967C1.3335 4.31778 4.31826 1.33301 8.00016 1.33301C11.6821 1.33301 14.6668 4.31778 14.6668 7.99967Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
