import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ConnectButtonProps } from '../../lib/typings';
export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        authenticationStatus,
        openAccountModal,
        openChainModal,
        openConnectModal
      }: ConnectButtonProps) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex flex-col text-right items-end px-2 py-1 hover:bg-black hover:bg-opacity-5 rounded-md"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex gap-6">
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex flex-col text-right items-end px-2 py-1 hover:bg-black hover:bg-opacity-5 rounded-md"
                  >
                    {account.displayName}
                    <span className="block text-sm opacity-50">
                      {account.displayBalance
                        ? `${account.displayBalance}`
                        : ''}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
