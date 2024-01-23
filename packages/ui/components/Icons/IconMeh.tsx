import { cn } from '../../lib/utilities';

export const IconMeh = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:stroke-black', className)}
    {...props}
  >
    <path
      d="M6.49992 12.4168C9.49146 12.4168 11.9166 9.9917 11.9166 7.00016C11.9166 4.00862 9.49146 1.5835 6.49992 1.5835C3.50838 1.5835 1.08325 4.00862 1.08325 7.00016C1.08325 9.9917 3.50838 12.4168 6.49992 12.4168Z"
      stroke="#DF0000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.33325 8.625H8.66659"
      stroke="#DF0000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.875 5.375H4.88042"
      stroke="#DF0000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.125 5.375H8.13042"
      stroke="#DF0000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
