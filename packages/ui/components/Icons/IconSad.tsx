import { cn } from '../../lib/utilities';

export const IconSad = ({
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
      d="M10.6666 10.6666C10.6666 10.6666 9.66658 9.33325 7.99992 9.33325C6.33325 9.33325 5.33325 10.6666 5.33325 10.6666M5.99992 5.99992H6.00659M9.99992 5.99992H10.0066M14.6666 7.99992C14.6666 11.6818 11.6818 14.6666 7.99992 14.6666C4.31802 14.6666 1.33325 11.6818 1.33325 7.99992C1.33325 4.31802 4.31802 1.33325 7.99992 1.33325C11.6818 1.33325 14.6666 4.31802 14.6666 7.99992Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
