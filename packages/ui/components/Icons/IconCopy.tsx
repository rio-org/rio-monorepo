import { cn } from '../../lib/utilities';
import { motion } from 'framer-motion';

export const IconCopy = ({
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
      d="M1.75 3.79932V10.1993C1.75 10.3993 1.85 10.5993 2 10.7493C2.15 10.8993 2.35 10.9993 2.55 10.9993H7.45M7.75 0.999512V3.49951H10.25M8 0.999512H4.55C4.35 0.999512 4.15 1.09951 4 1.24951C3.85 1.39951 3.75 1.59951 3.75 1.79951V8.19951C3.75 8.39951 3.85 8.59951 4 8.74951C4.15 8.89951 4.35 8.99951 4.55 8.99951H9.45C9.65 8.99951 9.85 8.89951 10 8.74951C10.15 8.59951 10.25 8.39951 10.25 8.19951V3.24951L8 0.999512Z"
    />
  </motion.svg>
);
