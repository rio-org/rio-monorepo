import { twJoin } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { Hash } from 'viem';
import IconExternal from '../Icons/IconExternal';
import { cn, linkToTxOnBlockExplorer } from '../../lib/utilities';
import { CHAIN_ID } from '../../config';

const baseClassName = twJoin(
  'flex flex-row flex-nowrap items-center gap-2',
  'max-w-full h-fit overflow-hidden px-2 py-0.5',
  'text-center text-gray-500 text-sm font-normal leading-none whitespace-nowrap',
  'transition-colors duration-200 '
);

export const ViewTransactionLink = ({
  hash,
  className,
  ...props
}: Parameters<typeof motion.a>[0] & { hash?: Hash }) => (
  <motion.a
    href={hash ? linkToTxOnBlockExplorer(hash, CHAIN_ID) : ''}
    target="_blank"
    rel="noreferrer"
    className={cn(baseClassName, className)}
    {...props}
  >
    <span>View transaction</span>
    <IconExternal className="opacity-50" />
  </motion.a>
);
