import { cn } from '../../lib/utilities';

export const IconKabob = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:fill-black', className)}
    {...props}
  >
    <path
      d="M12 12.9995C12.5523 12.9995 13 12.5518 13 11.9995C13 11.4472 12.5523 10.9995 12 10.9995C11.4477 10.9995 11 11.4472 11 11.9995C11 12.5518 11.4477 12.9995 12 12.9995Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 12.9995C19.5523 12.9995 20 12.5518 20 11.9995C20 11.4472 19.5523 10.9995 19 10.9995C18.4477 10.9995 18 11.4472 18 11.9995C18 12.5518 18.4477 12.9995 19 12.9995Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12.9995C5.55228 12.9995 6 12.5518 6 11.9995C6 11.4472 5.55228 10.9995 5 10.9995C4.44772 10.9995 4 11.4472 4 11.9995C4 12.5518 4.44772 12.9995 5 12.9995Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
