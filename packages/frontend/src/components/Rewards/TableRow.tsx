import React, { useEffect, useState } from 'react';
import { TransactionEvent } from '../../lib/typings';
import TableLabel from './TableLabel';
import cx from 'classnames';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';
import IconExternal from '../Icons/IconExternal';
import { useMediaQuery } from 'react-responsive';
import { AnimatePresence, motion } from 'framer-motion';
import IconLineArrow from '../Icons/IconLineArrow';
import IconExpand from '../Icons/IconExpand';
import { DESKTOP_MQ } from '../../lib/constants';

type Props = {
  event: TransactionEvent;
  isFirst?: boolean;
};

type ScreenSizeRowProps = {
  event: TransactionEvent;
  isOpen: boolean;
  chainId: number;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isFirst?: boolean;
};

const DesktopRow = ({ event, isFirst, chainId }: ScreenSizeRowProps) => {
  return (
    <tr className="group bg-white divide-gray-100">
      <td
        className={cx(
          'p-4 pl-6 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors',
          isFirst && 'rounded-tl-xl'
        )}
      >
        <TableLabel>
          <a
            href={linkToTxOnBlockExplorer('0x000', chainId)}
            target="_blank"
            rel="noreferrer"
            className={cx(
              `px-[8px] py-[4px] whitespace-nowrap text-sm flex items-center rounded-full w-fit gap-2 h-fit transition-colors duration-200 leading-none`
            )}
          >
            <span className="pt-1">{event.date}</span>
            <IconExternal transactionStatus="None" />
          </a>
        </TableLabel>
      </td>
      <td className="p-4 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors">
        <TableLabel>{event.type}</TableLabel>
      </td>

      <td className="p-4 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors">
        <TableLabel textDirection="right">
          ${event.historicalReEthPrice.toLocaleString()}
        </TableLabel>
      </td>
      <td className="p-4 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors">
        <div className="flex flex-col">
          <TableLabel textDirection="right">
            {event.amountReEth} reETH
          </TableLabel>
          <TableLabel isSecondary={true} textDirection="right">
            $
            {(+(event.amountReEth * event.historicalReEthPrice).toFixed(
              2
            )).toLocaleString()}
          </TableLabel>
        </div>
      </td>
      <td
        className={cx(
          'p-4 pr-6 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors',
          isFirst && 'rounded-tr-xl'
        )}
      >
        <TableLabel textDirection="right">{event.balance} reETH</TableLabel>
        <TableLabel isSecondary={true} textDirection="right">
          $
          {(+(event.balance * event.historicalReEthPrice).toFixed(
            2
          )).toLocaleString()}
        </TableLabel>
      </td>
    </tr>
  );
};

const MobileRow = ({
  event,
  isOpen,
  setIsOpen,
  isFirst,
  chainId
}: ScreenSizeRowProps) => {
  return (
    <tr
      className={cx(
        'group bg-white flex flex-wrap lg:table-row',
        isFirst && 'rounded-t-xl'
      )}
    >
      <td className={cx('text-left p-4 w-[50%]')}>
        <span className="text-[12px] font-normal opacity-50 flex">Date</span>
        <TableLabel>
          <a
            href={linkToTxOnBlockExplorer('0x000', chainId)}
            target="_blank"
            rel="noreferrer"
            className={cx(
              `whitespace-nowrap text-sm flex items-center rounded-full w-fit gap-1 h-fit transition-colors duration-200 leading-none`
            )}
          >
            <span className="pt-1">{event.date}</span>
            <IconLineArrow direction="external" />
          </a>
        </TableLabel>

        <button
          className="min-w-[90px] mt-1 text-[12px] rounded-full border border-[var(--color-blue)] text-[var(--color-blue)] px-3 py-[2px] transition-colors flex flex-row gap-1 justify-center items-center"
          onClick={() => setIsOpen && setIsOpen(!isOpen)}
        >
          <span className="">{isOpen ? 'Collapse' : 'Expand'}</span>
          <IconExpand isExpanded={isOpen} />
        </button>
      </td>
      <td
        className={cx(
          'p-4 pr-6 text-right bg-white w-[50%]',
          isFirst && 'rounded-tr-xl'
        )}
      >
        <span className="block text-[12px] font-normal opacity-50 text-right w-full">
          Balance / Amount
        </span>
        <TableLabel textDirection="right">
          <span className="pt-1 block">{event.balance} reETH</span>
        </TableLabel>
        <span className="mt-2 block">
          <TableLabel textDirection="right" isSecondary={true}>
            {event.amountReEth} reETH
          </TableLabel>
        </span>
      </td>

      <AnimatePresence>
        {isOpen && (
          <motion.td
            className="mx-4 overflow-hidden w-full"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          >
            <div className="border-t border-t-[var(--color-element-wrapper-bg)] flex flex-row justify-between gap-4 w-full">
              <div className="pt-2 pb-3">
                <span className="text-[12px] font-normal py-2 opacity-50 text-right w-full">
                  Transaction
                </span>
                <TableLabel>{event.type}</TableLabel>
              </div>
              <div className="pt-2 pb-3">
                <span className="text-[12px] font-normal py-2 opacity-50 text-right w-full">
                  Historical reETH price
                </span>
                <TableLabel textDirection="right">
                  ${event.historicalReEthPrice.toLocaleString()}
                </TableLabel>
              </div>
            </div>
          </motion.td>
        )}
      </AnimatePresence>
    </tr>
  );
};

const TableRow = ({ event, isFirst }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chainId = 1;
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted && !isDesktopOrLaptop) {
    return (
      <MobileRow
        event={event}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        chainId={chainId}
        isFirst={isFirst}
      />
    );
  }
  return (
    <DesktopRow
      event={event}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      chainId={chainId}
      isFirst={isFirst}
    />
  );
};

export default TableRow;
