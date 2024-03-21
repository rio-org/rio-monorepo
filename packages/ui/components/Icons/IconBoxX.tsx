import { cn } from '../../lib/utilities';

export const IconBoxX = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:stroke-foreground', className)}
    {...props}
  >
    <path
      d="M4 3.75L6.5 6.25M6.5 3.75L4 6.25M2.33333 1.25H8.16667C8.6269 1.25 9 1.6231 9 2.08333V7.91667C9 8.3769 8.6269 8.75 8.16667 8.75H2.33333C1.8731 8.75 1.5 8.3769 1.5 7.91667V2.08333C1.5 1.6231 1.8731 1.25 2.33333 1.25Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
