import { twJoin } from 'tailwind-merge';
import dayjs from 'dayjs';
import IconExternal from '../Icons/IconExternal';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';
import { CHAIN_ID } from '../../config';
import { Hash } from 'viem';

export function TransactionToast({
  icon,
  title,
  hash,
  chainId = CHAIN_ID
}: {
  icon: React.ReactNode;
  title: string;
  hash?: Hash;
  chainId?: number;
}) {
  return (
    <div className="flex gap-4 whitespace-nowrap items-center justify-between font-medium w-full">
      <div className="text-[14px] space-y-1.5">
        <span className="flex items-center gap-1 font-medium">
          {icon} <span>{title}</span>
        </span>
        <span className="font-normal opacity-50">
          {dayjs().format('MMMM D, YYYY * h:mm A').replace(/\*/, 'at')}
        </span>
      </div>
      {!hash ? (
        <div />
      ) : (
        <a
          className={twJoin(
            'flex items-center gap-1.5',
            'h-6 px-2 py-1',
            'bg-blackA2 rounded-[4px] text-xs text-black',
            'opacity-50 hover:opacity-90 active:opacity-100'
          )}
          href={linkToTxOnBlockExplorer(hash, chainId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View</span>
          <IconExternal className="w-[10px] h-[10px]" />
        </a>
      )}
    </div>
  );
}
