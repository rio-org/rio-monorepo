import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDisconnect } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccountIfMounted } from '../hooks/useAccountIfMounted';
import { useAcceptedTerms } from '../hooks/useAcceptedTerms';
import { useRegionChecked } from '../hooks/useRegionChecked';
import { GeofenceModal } from '../components/Shared/GeofenceModal';
import { AcceptTermsModal } from '../components/Shared/AcceptTermsModal';
import { asType } from '../lib/utilities';
import { useSupportedChainId } from '../hooks/useSupportedChainId';

type BadGlobalThis =
  | undefined
  | (Global & {
      showDisconnectModal?: boolean;
    });

const enum WalletModalStep {
  GEOFENCE = 'GEOFENCE',
  TERMS = 'TERMS',
  WALLET = 'WALLET'
}

interface ContextState {
  walletModalOpen: boolean;
  openWalletModal: () => void;
}

const DEFAULT_STATE: ContextState = {
  walletModalOpen: false,
  openWalletModal: () => {}
};

const WalletAndTermsStoreContext = createContext<ContextState>(DEFAULT_STATE);

export default function WalletAndTermsStoreProvider({
  children,
  requireGeofence,
  requireTerms
}: {
  children: React.ReactNode;
  requireGeofence?: boolean;
  requireTerms?: boolean;
}) {
  const _globalThis =
    typeof globalThis !== 'undefined'
      ? asType<BadGlobalThis>(globalThis)
      : undefined;

  const { address } = useAccountIfMounted();
  const chainId = useSupportedChainId();
  const { disconnect } = useDisconnect();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [acceptedToS] = useAcceptedTerms();
  const [regionChecked, regionCheckedMutation] = useRegionChecked();
  const [showDisconnectOnNetworkChange, setShowDisconnectOnNetworkChange] =
    useState(!!_globalThis?.showDisconnectModal);

  const isMainnet = chainId === mainnet.id;

  const isRegionBlocked = useMemo(
    () => regionChecked.data === false,
    [regionChecked.data]
  );

  const nextModal = useMemo<WalletModalStep>(() => {
    if (isMainnet && requireGeofence && regionChecked.data !== true)
      return WalletModalStep.GEOFENCE;
    if (requireTerms && !acceptedToS.data) return WalletModalStep.TERMS;
    return WalletModalStep.WALLET;
  }, [
    isMainnet,
    requireGeofence,
    requireTerms,
    acceptedToS.data,
    acceptedToS.isLoading,
    regionChecked.data
  ]);

  const disconnectOnNetworkChangeIfGeoblocked = useCallback(() => {
    if (!isMainnet) return;
    if (!address) return;
    if (!isRegionBlocked) return;
    if (_globalThis) _globalThis.showDisconnectModal = true;
    setShowDisconnectOnNetworkChange(true);
    disconnect();
  }, [requireGeofence, isRegionBlocked, isMainnet, address, disconnect]);

  const mutate = useCallback(() => regionCheckedMutation.mutate(null), []);

  const fetchRegionBlockOnModalOpen = useCallback(() => {
    if (!isMainnet) return;
    if (isRegionBlocked) return;
    if (!walletModalOpen) return;
    mutate();
  }, [isMainnet, requireGeofence, walletModalOpen, isRegionBlocked]);

  const fetchRegionBlockOnNetworkChange = useCallback(() => {
    if (isRegionBlocked) return;
    if (walletModalOpen) return;
    if (!isMainnet) return;
    if (!address) return;
    mutate();
  }, [walletModalOpen, isRegionBlocked, isMainnet, address]);

  useEffect(() => {
    if (!requireGeofence) return;
    fetchRegionBlockOnModalOpen();
    fetchRegionBlockOnNetworkChange();
    disconnectOnNetworkChangeIfGeoblocked();
  }, [
    requireGeofence,
    fetchRegionBlockOnModalOpen,
    fetchRegionBlockOnNetworkChange,
    disconnectOnNetworkChangeIfGeoblocked
  ]);

  useEffect(() => {
    setWalletModalOpen(connectModalOpen);
  }, [connectModalOpen]);

  useEffect(
    function openConnectModalWhenEligible() {
      if (address) return;
      if (!walletModalOpen) return;
      if (nextModal !== WalletModalStep.WALLET) return;
      openConnectModal?.();
    },
    [address, walletModalOpen, nextModal, openConnectModal]
  );

  const handleCloseWalletModal = useCallback(
    () => setWalletModalOpen(false),
    []
  );

  const openWalletModal = useCallback(() => {
    if (walletModalOpen) return;
    setWalletModalOpen(true);
  }, [regionCheckedMutation.mutate]);

  return (
    <WalletAndTermsStoreContext.Provider
      value={useMemo(
        () => ({ walletModalOpen, openWalletModal }),
        [walletModalOpen, openWalletModal]
      )}
    >
      {children}
      {requireGeofence && (
        <GeofenceModal
          isOpen={
            walletModalOpen
              ? nextModal === WalletModalStep.GEOFENCE
              : showDisconnectOnNetworkChange
          }
          handler={
            walletModalOpen
              ? handleCloseWalletModal
              : () => {
                  if (_globalThis) _globalThis.showDisconnectModal = false;
                  setShowDisconnectOnNetworkChange(false);
                }
          }
          refetch={mutate}
          isRegionBlocked={isRegionBlocked}
          isLoading={regionCheckedMutation.isPending || regionChecked.isLoading}
          isError={regionCheckedMutation.isError}
        />
      )}
      {requireTerms && (
        <AcceptTermsModal
          isOpen={walletModalOpen && nextModal === WalletModalStep.TERMS}
          handler={handleCloseWalletModal}
        />
      )}
    </WalletAndTermsStoreContext.Provider>
  );
}

//////////
// hooks
//////////

export function useWalletAndTermsStore() {
  return useContext(WalletAndTermsStoreContext);
}
