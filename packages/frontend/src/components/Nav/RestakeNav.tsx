// import { Tabs, Tab } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { appNavItems } from '../../lib/constants'
import { Tabs, TabsHeader, TabsBody, TabPanel, Tab } from '@material-tailwind/react'
import cx from 'classnames'

type Props = {}

const RestakeNav = (props: Props) => {
  const router = useRouter();
  const activeTab = appNavItems.find((item) => item.slug === router.pathname)?.slug;

  return (
    <div className='flex w-full text-center content-center justify-center'>
      <Tabs value={activeTab}>
        <TabsHeader className='rounded-[16px] bg-black bg-opacity-5 p-[2px]'>
          {appNavItems.map(({ label, slug }) => (
            <Link href={slug} key={slug} passHref>
              <Tab value={slug} key={slug} className={cx('py-2 px-4 font-medium hover:text-black', activeTab === slug ? "" : "text-gray-500")} aria-label={label}>
                {label}
              </Tab>
            </Link>
          ))}
        </TabsHeader>
      </Tabs>
    </div>
  )
}

export default RestakeNav