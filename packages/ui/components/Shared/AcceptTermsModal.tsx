import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox
} from '@material-tailwind/react';
import {
  RainbowKitDisclaimer,
  RainbowKitDisclaimerType
} from './RainbowKitDisclaimer';
import { useAcceptedTerms } from '../../hooks/useAcceptedTerms';

export function AcceptTermsModal({
  isOpen,
  handler,
  onAccept
}: {
  isOpen: boolean;
  handler: () => void;
  onAccept?: () => void;
}) {
  const [{ data: acceptedTerms }, { mutate: setAcceptedTerms }] =
    useAcceptedTerms();
  const [accepted, setAccepted] = useState(acceptedTerms);

  const handleClick = useCallback(() => {
    if (!accepted) return;
    setAcceptedTerms(true);
    onAccept?.();
  }, [accepted, setAcceptedTerms, onAccept]);

  return (
    <Dialog size="sm" open={isOpen} handler={handler}>
      <DialogHeader>
        <h2 className="text-xl font-medium">Terms of Service</h2>
      </DialogHeader>
      <DialogBody>
        <Checkbox
          crossOrigin="false"
          checked={accepted ?? undefined}
          onChange={() => setAccepted((prev) => !prev)}
          className="shrink-0 min-w-[20px]"
          containerProps={{ className: 'min-w-[44px]' }}
          labelProps={{ className: 'p-2 leading-snug' }}
          label={
            <RainbowKitDisclaimer
              action={RainbowKitDisclaimerType.CHECKING}
              Text={Text}
              Link={Link}
            />
          }
        />
      </DialogBody>
      <DialogFooter>
        <motion.button
          disabled={!accepted}
          onClick={handleClick}
          className={twJoin(
            'w-full py-3 rounded-full',
            'text-white font-bold',
            'bg-black transition-colors duration-200',
            'hover:bg-[var(--color-dark-gray)]',
            'disabled:!bg-opacity-20 disabled:!bg-black',
            'disabled:[&>span]:!opacity-20 disabled:[&>span]:!text-black'
          )}
        >
          Connect wallet
        </motion.button>
      </DialogFooter>
    </Dialog>
  );
}

function Link(props: { href: string; children: React.ReactNode }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
      {...props}
    />
  );
}

function Text(props: { children: React.ReactNode }) {
  return <span {...props} />;
}
