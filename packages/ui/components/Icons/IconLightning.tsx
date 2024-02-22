import { cn } from '../../lib/utilities';

export const IconLightning = ({
  className,
  strokeWidth = 1.5,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:stroke-black', className)}
    {...props}
  >
    <path
      d="M8.66667 1.83337L2 9.83337H8L7.33333 15.1667L14 7.16671H8L8.66667 1.83337Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
