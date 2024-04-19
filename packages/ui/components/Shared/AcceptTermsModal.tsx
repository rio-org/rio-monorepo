import { useCallback, useState } from 'react';
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
import { FramerButton } from '../shadcn/button';

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
    <Dialog
      className="text-foreground bg-background border border-border rounded-[4px]"
      size="sm"
      open={isOpen}
      handler={handler}
    >
      <DialogHeader className="text-foreground">
        <h2 className="text-xl font-medium">Terms of Service</h2>
      </DialogHeader>
      <DialogBody className="text-foreground">
        <Checkbox
          crossOrigin="false"
          checked={accepted ?? undefined}
          onChange={() => setAccepted((prev) => !prev)}
          className="shrink-0 min-w-[20px] rounded-[4px] border-foreground/50 checked:bg-primary [&+span_path]:fill-primary-foreground [&+span_path]:stroke-primary-foreground"
          containerProps={{ className: 'min-w-[44px]' }}
          labelProps={{
            className: 'p-2 leading-snug font-sans text-foreground'
          }}
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
        <FramerButton
          disabled={!accepted}
          onClick={handleClick}
          className="w-full rounded-[4px]"
        >
          Connect wallet
        </FramerButton>
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
