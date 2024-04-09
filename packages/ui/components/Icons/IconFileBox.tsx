import { cn } from '../../lib/utilities';
import { motion } from 'framer-motion';

export const IconFileBox = ({
  className,
  ...props
}: React.ComponentProps<typeof motion.svg>) => (
  <motion.svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:stroke-foreground', className)}
    {...props}
  >
    <motion.path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.25 11H9C9.26522 11 9.51957 10.8946 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10V3.75L7.25 1H3C2.73478 1 2.48043 1.10536 2.29289 1.29289C2.10536 1.48043 2 1.73478 2 2V4M7 1V4H10M3.5 8.5002L1.13 7.0752M3.5 8.5002L5.87 7.0752M3.5 8.5002L3.5 11M1.485 6.55987C1.185 6.73987 1 7.06987 1 7.42987V9.06987C1 9.42987 1.185 9.75987 1.485 9.93987L2.985 10.8549C3.3 11.0499 3.7 11.0499 4.015 10.8549L5.515 9.93987C5.815 9.75987 6 9.42987 6 9.06987V7.42987C6 7.06987 5.815 6.73987 5.515 6.55987L4.015 5.64487C3.86004 5.54982 3.68179 5.49951 3.5 5.49951C3.31821 5.49951 3.13996 5.54982 2.985 5.64487L1.485 6.55987Z"
    />
  </motion.svg>
);
