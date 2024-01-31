import { AnimatePresence, motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner
} from '@material-tailwind/react';
import { cn } from '../../lib/utilities';
import { RioExpandedLogo } from './RioExpandedLogo';

const variants = {
  initial: { opacity: 0, maxHeight: 0 },
  animate: { opacity: 1, maxHeight: 1000 },
  exit: { opacity: 0, maxHeight: 0 }
};

const MotionHeader = motion(DialogHeader);
const MotionFooter = motion(DialogFooter);

export function GeofenceModal({
  isOpen,
  handler,
  refetch,
  isLoading,
  isRegionBlocked,
  isError
}: {
  isOpen: boolean;
  handler: () => void;
  refetch: () => void;
  isLoading: boolean;
  isRegionBlocked: boolean;
  isError: boolean;
}) {
  return (
    <Dialog
      size="sm"
      open={isOpen}
      handler={isLoading || isRegionBlocked ? () => {} : handler}
      className="flex flex-col align-center text-center"
    >
      <AnimatePresence>
        {!isError && isRegionBlocked && (
          <MotionHeader
            {...variants}
            className="flex justify-center mt-4 overflow-hidden"
          >
            <RioExpandedLogo />
          </MotionHeader>
        )}
      </AnimatePresence>
      <DialogBody
        className={cn(
          'flex justify-center font-semibold font-sans py-4 px-8',
          isError && 'pt-8',
          !isError && !isRegionBlocked && 'py-10'
        )}
      >
        <AnimatePresence>
          {isError ? (
            <motion.div {...variants} className="overflow-hidden">
              An error occurred. Please try again.
            </motion.div>
          ) : isRegionBlocked ? (
            <motion.div {...variants} className="overflow-hidden">
              According to your IP address, you are in a restricted
              jurisdiction. Unfortunately, we are unable to provide services to
              users in your region.
            </motion.div>
          ) : (
            <motion.div {...variants} className="overflow-hidden">
              <Spinner scale={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogBody>
      {(isRegionBlocked || isError) && (
        <MotionFooter {...variants} className="overflow-hidden">
          <motion.button
            onClick={isError ? refetch : handler}
            className={twJoin(
              'w-full py-3 rounded-full',
              'text-white font-bold',
              'bg-black transition-colors duration-200',
              'hover:bg-[var(--color-dark-gray)]',
              'disabled:!bg-opacity-20 disabled:!bg-black',
              'disabled:[&>span]:!opacity-20 disabled:[&>span]:!text-black'
            )}
          >
            Okay
          </motion.button>
        </MotionFooter>
      )}
    </Dialog>
  );
}
