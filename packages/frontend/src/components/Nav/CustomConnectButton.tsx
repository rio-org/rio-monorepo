import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ConnectButtonProps, EthereumAddress } from '../../lib/typings';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Drawer,
  Spinner
} from '@material-tailwind/react';
import { useBalance, useDisconnect } from 'wagmi';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useRef, useState } from 'react';
import ReETHConversion from '../Shared/ReETHConversion';
import { DESKTOP_MQ, REETH_ADDRESS } from '../../lib/constants';
import cx from 'classnames';
import { mainNavConnectVariants } from '../../lib/motion';
import { motion } from 'framer-motion';
import { formatEther, formatUnits } from 'viem';
import { truncDec } from '../../lib/utilities';

export const CustomConnectButton = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const drawerContentRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        authenticationStatus,
        openChainModal,
        openConnectModal,
        connectModalOpen
      }: ConnectButtonProps) => {
        const [isLoading, setIsLoading] = useState(false);
        const [isDisconnected, setIsDisconnected] = useState(false);
        const ready = mounted && authenticationStatus !== 'loading';
        const { disconnect } = useDisconnect({
          onSuccess() {
            setIsDisconnected(true);
            setIsLoading(false);
            setOpenNav(false);
          }
        });

        const { data: reEthBalance, isError: isBalanceError, isLoading: isBalanceLoading } = useBalance({
          address: account?.address as EthereumAddress,
          token: REETH_ADDRESS
        });

        useEffect(() => {
          account && setIsDisconnected(false);
          account && setIsLoading(false);
        }, [account]);

        useEffect(() => {
          connectModalOpen && setIsLoading(true);
          !connectModalOpen && setIsLoading(false);
        }, [connectModalOpen]);

        return (
          <motion.div
            key={account?.address}
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
            className="lg:ml-auto"
            variants={mainNavConnectVariants}
          >
            {(() => {
              if (isDisconnected || !account) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="relative flex flex-col text-right items-end px-4 py-2 hover:bg-opacity-70 bg-black text-white rounded-full font-medium"
                  >
                    <span className={cx(isLoading && 'text-transparent')}>
                      Connect wallet
                    </span>
                    {isLoading && (
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 ml-0">
                        <Spinner />
                      </span>
                    )}
                  </button>
                );
              }
              if (chain?.unsupported) {
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
                  <button
                    onClick={() => !isDesktopOrLaptop && setOpenNav(true)}
                    type="button"
                    className="lg:hidden flex flex-col text-right items-end px-2 py-1 hover:bg-black hover:bg-opacity-5 rounded-md hover:cursor-pointer"
                  >
                    {isLoading ? <Spinner /> : account?.displayName}
                  </button>
                  <div className="hidden lg:block">
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <div className="flex flex-col py-1 px-2 text-right items-end hover:bg-black hover:bg-opacity-5 rounded-md hover:cursor-pointer text-[14px]">
                          {account?.displayName}
                          <span className="text-sm opacity-50 hidden lg:block">
                            {(reEthBalance ? truncDec(+formatUnits(reEthBalance.value, reEthBalance.decimals)) : 0) + `reETH`}
                            {/* {account?.balanceFormatted
                              ? `${Math.trunc(+account.balanceFormatted * 1000) /
                              1000
                              } reETH`
                              : ''} */}
                          </span>
                        </div>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem>
                          <span
                            onClick={() => {
                              disconnect();
                              setIsLoading(true);
                            }}
                          >
                            Disconnect
                          </span>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                  {isMounted && !isDesktopOrLaptop && (
                    <Drawer
                      placement="bottom"
                      size={drawerContentRef.current?.offsetHeight}
                      open={!isDesktopOrLaptop && openNav}
                      onClose={() => !isDesktopOrLaptop && setOpenNav(false)}
                      className="rounded-t-2xl"
                    >
                      <div
                        ref={drawerContentRef}
                        className="p-4 pb-6 flex flex-col gap-2"
                      >
                        <div className="flex flex-row justify-between mb-2 text-black">
                          {account?.displayName}
                          <span className="text-sm opacity-50 -tracking-tighter">
                            {reEthBalance
                              ? formatEther(reEthBalance.value) + `reETH`
                              : ''}
                            {/* {account?.balanceFormatted
                              ? `${Math.trunc(+account.balanceFormatted * 1000) /
                              1000
                              } reETH`
                              : ''} */}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            disconnect();
                            setIsLoading(true);
                          }}
                          className="flex flex-col items-center px-4 py-2 hover:bg-opacity-70 bg-black text-white rounded-full font-medium w-full text-center"
                        >
                          {isLoading || !account ? <Spinner /> : 'Disconnect'}
                        </button>
                        <ReETHConversion padded />
                      </div>
                    </Drawer>
                  )}
                </div>
              );
            })()}
          </motion.div>
        );
      }}
    </ConnectButton.Custom>
  );
};
