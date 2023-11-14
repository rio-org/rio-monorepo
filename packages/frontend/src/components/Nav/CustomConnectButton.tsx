import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ConnectButtonProps } from '../../lib/typings';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem
} from '@material-tailwind/react';
import { useDisconnect } from 'wagmi';
export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        authenticationStatus,
        openChainModal,
        openConnectModal
      }: ConnectButtonProps) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        const { disconnect } = useDisconnect();
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
                    className="flex flex-col text-right items-end px-4 py-2 hover:bg-opacity-70 bg-black text-white rounded-full font-medium"
                  >
                    Connect wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex flex-col text-right items-end px-2 py-1 hover:bg-black hover:bg-opacity-5 rounded-md"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex gap-6">
                  <Menu placement="bottom-end">
                    <MenuHandler>
                      <div className="flex flex-col text-right items-end px-2 py-1 hover:bg-black hover:bg-opacity-5 rounded-md hover:cursor-pointer">
                        {account.displayName}
                        <span className="block text-sm opacity-50">
                          {account.displayBalance
                            ? `${account.displayBalance}`
                            : ''}
                        </span>
                      </div>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem>
                        <button onClick={() => disconnect()}>Disconnect</button>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  {/* <Menu> */}
                  {/* <MenuHandler>
                      <Button>Menu</Button>
                    </MenuHandler> */}
                  {/* <MenuList>
                      <MenuItem>Menu Item 1</MenuItem>
                      <MenuItem>Menu Item 2</MenuItem>
                      <MenuItem>Menu Item 3</MenuItem>
                    </MenuList> */}
                  {/* </Menu> */}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
