import { DisclaimerComponent } from '@rainbow-me/rainbowkit';

export const RainbowKitDisclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{' '}
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
