import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react'
import { useAccount } from 'wagmi';
import { CustomConnectButton } from './CustomConnectButton';

type Props = {}

const AccountNav = (props: Props) => {
  const { address, isConnecting, isDisconnected } = useAccount()
  return (
    <div className='absolute top-0 right-0'>
      <CustomConnectButton />
      {/* {isDisconnected ? (
        <p>not logged in
          <CustomConnectButton />
        </p>
      ) : (
        <>
          <p>{address}</p>
        </>
      )} */}


    </div>
  )
}

export default AccountNav