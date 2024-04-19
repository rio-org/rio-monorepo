import { cn } from '../../lib/utilities';

export const IconWarningOctagon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:stroke-foreground', className)}
    {...props}
  >
    <path
      d="M10.0001 6.66699V10.0003M10.0001 13.3337H10.0084M6.55008 1.66699H13.4501L18.3334 6.55032V13.4503L13.4501 18.3337H6.55008L1.66675 13.4503V6.55032L6.55008 1.66699Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
