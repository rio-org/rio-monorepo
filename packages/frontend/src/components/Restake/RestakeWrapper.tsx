import React from 'react'

type Props = {
  children: React.ReactNode
}

const RestakeWrapper = ({ children }: Props) => {
  return (
    <div className='h-full flex items-center justify-center'>
      <div className='w-full lg:max-w-[588px]'>
        {children}
      </div>
    </div>
  )
}

export default RestakeWrapper