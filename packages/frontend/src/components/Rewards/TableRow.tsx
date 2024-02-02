import React, { useState } from 'react';
import { type TableColumn } from '@rio-monorepo/ui/lib/typings';
import TableLabel from './TableLabel';
import { cn } from '@rio-monorepo/ui/lib/utilities';
import { useMediaQuery } from 'react-responsive';
import { AnimatePresence, motion } from 'framer-motion';
import IconExpand from '@rio-monorepo/ui/components/Icons/IconExpand';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { twJoin } from 'tailwind-merge';

interface TableRowProps<T> {
  item: T;
  isFirst?: boolean;
  index?: number;
  columns: TableColumn<T>[];
  mobileColumns: {
    top: TableColumn<T>[];
    expanded?: TableColumn<T>[];
  };
}

const animationDuration = 0.1;
const animationDelay = 0.025;
const exitDuration = 0.085;

interface DesktopTableRowProps<T>
  extends Omit<TableRowProps<T>, 'mobileColumns'> {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

type DesktopTableRowComponent = <T>(
  props: DesktopTableRowProps<T>
) => React.ReactNode;

const DesktopRow: DesktopTableRowComponent = ({
  item,
  columns,
  isFirst,
  index = 0
}) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.tr className="group bg-white divide-gray-100">
          {columns.map(({ key, render }, keyIndex) => (
            <motion.td
              className={cn(
                'p-4 pl-6 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors',
                !keyIndex && isFirst && 'rounded-tl-xl',
                keyIndex === columns.length - 1 && isFirst && 'rounded-tr-xl'
              )}
              key={`${index}-${keyIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: exitDuration } }}
              transition={{
                duration: animationDuration,
                delay: index * animationDelay
              }}
            >
              {render?.(TableLabel, item, key) ?? (
                <TableLabel
                  textDirection={
                    keyIndex >= Math.ceil((columns.length - 1) / 2)
                      ? 'right'
                      : undefined
                  }
                >
                  {item[key] as React.ReactNode}
                </TableLabel>
              )}
            </motion.td>
          ))}
        </motion.tr>
      )}
    </AnimatePresence>
  );
};

interface MobileTableRowProps<T>
  extends Omit<DesktopTableRowProps<T>, 'columns'> {
  columns: TableRowProps<T>['mobileColumns'];
}

type MobileTableRowComponent = <T>(
  props: MobileTableRowProps<T>
) => React.ReactNode;

const MobileRow: MobileTableRowComponent = ({
  item,
  columns,
  isOpen,
  setIsOpen,
  isFirst
}) => {
  return (
    <tr
      className={cn(
        'group bg-white flex flex-wrap lg:table-row',
        isFirst && 'rounded-t-xl'
      )}
    >
      {columns.top.map(({ key, label, render }, keyIndex) => {
        const _key = key.toString();
        const _label = label || _key[0].toUpperCase() + _key.slice(1);
        const rightColumn =
          !!keyIndex &&
          keyIndex >= Math.ceil((columns.top.length - 1) / 2) &&
          'text-right';

        return (
          <td key={_key} className={cn('text-left p-4 w-[50%]', rightColumn)}>
            <span
              className={cn(
                'text-[12px] font-normal opacity-50 w-full flex',
                rightColumn && 'justify-end'
              )}
            >
              {_label}
            </span>
            {render?.(TableLabel, item, key) ?? (
              <TableLabel textDirection={rightColumn ? 'right' : undefined}>
                {item[key] as React.ReactNode}
              </TableLabel>
            )}
            {!keyIndex && !!columns.expanded?.length && (
              <button
                onClick={() => setIsOpen && setIsOpen(!isOpen)}
                className={twJoin(
                  'flex flex-row gap-1 justify-center items-center',
                  'min-w-[90px] mt-2 px-3 py-[2px]',
                  'rounded-full border border-[var(--color-blue)]',
                  'text-[12px] text-[var(--color-blue)] transition-colors'
                )}
              >
                <span className="">{isOpen ? 'Collapse' : 'Expand'}</span>
                <IconExpand isExpanded={isOpen} />
              </button>
            )}
          </td>
        );
      })}

      <AnimatePresence>
        {isOpen && !!columns.expanded?.length && (
          <motion.td
            className={twJoin(
              'overflow-hidden w-full',
              'flex flex-row justify-between gap-4',
              'mx-4 px-4',
              'rounded-xl bg-[var(--color-app-bg)] bg-opacity-25'
            )}
            initial={{ height: 0, marginBottom: 0 }}
            animate={{ height: 'auto', marginBottom: '1rem' }}
            exit={{ height: 0, marginBottom: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          >
            {columns.expanded.map(({ key, label, render }, keyIndex) => {
              const _key = key.toString();
              const _label = label || _key[0].toUpperCase() + _key.slice(1);
              const rightColumn =
                !!keyIndex &&
                keyIndex >= Math.ceil((columns.top.length - 1) / 2) &&
                'text-right';

              return (
                <div className="pt-2 pb-3">
                  <span
                    className={cn(
                      'text-[12px] font-normal py-2 opacity-50 text-left w-full',
                      rightColumn
                    )}
                  >
                    {_label}
                  </span>
                  {render?.(TableLabel, item, key) ?? (
                    <TableLabel
                      textDirection={rightColumn ? 'right' : undefined}
                    >
                      {item[key] as React.ReactNode}
                    </TableLabel>
                  )}
                </div>
              );
            })}
          </motion.td>
        )}
      </AnimatePresence>
    </tr>
  );
};

type TableRowComponent = <T>(props: TableRowProps<T>) => React.ReactNode;

const TableRow: TableRowComponent = ({
  item,
  mobileColumns,
  columns,
  isFirst,
  index
}) => {
  const isMounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  if (isMounted && !isDesktopOrLaptop) {
    return (
      <MobileRow
        item={item}
        columns={mobileColumns}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isFirst={isFirst}
        index={index}
      />
    );
  }
  return (
    <DesktopRow
      item={item}
      columns={columns}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isFirst={isFirst}
      index={index}
    />
  );
};

export default TableRow;
