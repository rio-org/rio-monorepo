import { cn } from '../../lib/utilities';

export const IconMedal = ({
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
    className={cn('[&>path]:stroke-foreground', className)}
    {...props}
  >
    <path
      d="M10.318 9.09301L11.3333 15.1663L8 13.1663L4.66667 15.1663L5.682 9.09301M12 5.83301C12 8.04215 10.2091 9.83301 8 9.83301C5.79086 9.83301 4 8.04215 4 5.83301C4 3.62387 5.79086 1.83301 8 1.83301C10.2091 1.83301 12 3.62387 12 5.83301Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
