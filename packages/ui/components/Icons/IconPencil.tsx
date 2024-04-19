import { cn } from '../../lib/utilities';

export const IconPencil = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:stroke-foreground', className)}
    {...props}
  >
    <path
      d="M9.75 1.5835L11.9167 3.75016"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.06266 11.6043L10.2918 5.37516L8.12516 3.2085L1.896 9.43766L1.0835 12.4168L4.06266 11.6043Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
