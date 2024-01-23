import { cn } from '../../lib/utilities';

export const IconTrashCan = ({
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
      d="M1.625 3.75H11.375"
      stroke="#66728A"
      strokeWidth="0.928571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.2913 3.75V11.3333C10.2913 11.875 9.74967 12.4167 9.20801 12.4167H3.79134C3.24967 12.4167 2.70801 11.875 2.70801 11.3333V3.75"
      stroke="#66728A"
      strokeWidth="0.928571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.33301 3.74967V2.66634C4.33301 2.12467 4.87467 1.58301 5.41634 1.58301H7.58301C8.12467 1.58301 8.66634 2.12467 8.66634 2.66634V3.74967"
      stroke="#66728A"
      strokeWidth="0.928571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.41699 6.45801V9.70801"
      stroke="#66728A"
      strokeWidth="0.928571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.58301 6.45801V9.70801"
      stroke="#66728A"
      strokeWidth="0.928571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
