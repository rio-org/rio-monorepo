export enum RainbowKitDisclaimerType {
  CONNECTING = 'CONNECTING',
  CHECKING = 'CHECKING'
}

export const RainbowKitDisclaimer = ({
  Text,
  Link,
  action = RainbowKitDisclaimerType.CONNECTING
}: {
  Text: React.FunctionComponent<{
    children: React.ReactNode;
  }>;
  Link: React.FunctionComponent<{
    children: React.ReactNode;
    href: string;
  }>;
  action?: RainbowKitDisclaimerType;
}) => (
  <Text>
    By{' '}
    {action === RainbowKitDisclaimerType.CONNECTING
      ? 'connecting your wallet'
      : 'checking this box'}
    , you agree to the{' '}
    <Link href="https://rio.gitbook.io/rio-network-docs/Zpr3aRB42rSynxPoQOKe/privacy/terms-of-use">
      Terms of Service
    </Link>{' '}
    and understand the{' '}
    <Link href="https://rio.gitbook.io/rio-network-docs/Zpr3aRB42rSynxPoQOKe/privacy/privacy-policy">
      Privacy Policy
    </Link>
    .
  </Text>
);
