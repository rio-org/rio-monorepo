import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { mainnet, useChainId, useDisconnect, useNetwork } from 'wagmi';
import { CHAIN_ID } from '../config';
import { CHAIN_ID_NUMBER } from '../lib/typings';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccountIfMounted } from '../hooks/useAccountIfMounted';
import { useAcceptedTerms } from '../hooks/useAcceptedTerms';
import { useRegionChecked } from '../hooks/useRegionChecked';
import { GeofenceModal } from '../components/Shared/GeofenceModal';
import { AcceptTermsModal } from '../components/Shared/AcceptTermsModal';
import { asType } from '../lib/utilities';

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

  const { chain } = useNetwork();
  const defaultChainId = useChainId() || CHAIN_ID;
  const chainId = (chain?.id || defaultChainId) as CHAIN_ID_NUMBER;
  const { address } = useAccountIfMounted();
  const { disconnect } = useDisconnect();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [acceptedToS] = useAcceptedTerms();
  const [regionChecked, regionCheckedMutation] = useRegionChecked();
  const [showDisconnectOnNetworkChange, setShowDisconnectOnNetworkChange] =
    useState(!!_globalThis?.showDisconnectModal);

  const isMainnet = chainId === mainnet.id;

  regionCheckedMutation.isLoading || regionChecked.isLoading;
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

  const fetchRegionBlockOnModalOpen = useCallback(() => {
    if (!isMainnet) return;
    if (isRegionBlocked) return;
    if (!walletModalOpen) return;
    regionCheckedMutation.mutate();
  }, [isMainnet, requireGeofence, walletModalOpen, isRegionBlocked]);

  const fetchRegionBlockOnNetworkChange = useCallback(() => {
    if (isRegionBlocked) return;
    if (walletModalOpen) return;
    if (!isMainnet) return;
    if (!address) return;
    regionCheckedMutation.mutate();
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
          refetch={regionCheckedMutation.mutate}
          isRegionBlocked={isRegionBlocked}
          isLoading={regionCheckedMutation.isLoading || regionChecked.isLoading}
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
