import { cn } from '../../lib/utilities';

export const IconX = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:stroke-foreground', className)}
    {...props}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
