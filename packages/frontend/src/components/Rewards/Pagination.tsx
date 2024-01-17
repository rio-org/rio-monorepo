import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import IconLineArrow from '../Icons/IconLineArrow';
import cx from 'classnames';
import { usePagination } from '../../hooks/usePagination';

type Props = Partial<ReturnType<typeof usePagination>> &
  Pick<
    ReturnType<typeof usePagination>,
    | 'pages'
    | 'pageCount'
    | 'currentPage'
    | 'hasNextPage'
    | 'goToNextPage'
    | 'goToPreviousPage'
    | 'setCurrentPage'
  > & {
    className?: string;
  };

const Pagination = ({
  pages,
  currentPage,
  hasNextPage,
  goToPreviousPage,
  goToNextPage,
  setCurrentPage,
  className
}: Props) => {
  const [buttonHoverIndex, setButtonHoverIndex] = useState<number | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const prevLabel = 'Previous';
  const nextLabel = 'Next';

  return (
    <motion.div
      layoutId="pagination"
      transition={{ delay: 0 }}
      className={className}
    >
      <div className="bg-white w-full flex items-center justify-between border-t border-blue-gray-50 p-4 rounded-b-xl">
        <button
          className="text-[12px] whitespace-nowrap py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors flex flex-row gap-1 items-center group disabled:opacity-40 disabled:hover:bg-white"
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <IconLineArrow direction="left" />{' '}
          <span
            className={cx(
              'opacity-50 group-hover:opacity-100 hidden lg:block',
              currentPage === 0 && 'group-hover:opacity-40'
            )}
          >
            {prevLabel}
          </span>
        </button>
        <div className="flex items-center justify-center gap-3 lg:gap-1 w-full">
          {pages.map((i) => (
            <button
              key={i}
              className={cx(
                'text-[12px] py-1 px-2 rounded-lg opacity-50 transition-colors relative'
              )}
              onClick={() => setCurrentPage(i)}
              onMouseOver={() => {
                setIsButtonHovered(true);
                setButtonHoverIndex(i);
              }}
              onMouseLeave={() => {
                setIsButtonHovered(false);
                setButtonHoverIndex(null);
              }}
              disabled={currentPage === i}
            >
              <span className="relative z-10">{i + 1}</span>

              <AnimatePresence>
                {currentPage === i && (
                  <motion.div className="absolute z-0 inset-0 opacity-40 bg-[var(--color-element-wrapper-bg)] rounded-lg" />
                )}
              </AnimatePresence>
              {!isButtonHovered && currentPage === i && (
                <motion.div
                  className="absolute z-0 inset-0 bg-[var(--color-element-wrapper-bg)] rounded-lg"
                  layoutId="page-button-bg"
                />
              )}
              {isButtonHovered && buttonHoverIndex === i && (
                <motion.div
                  className="absolute z-0 inset-0 bg-[var(--color-element-wrapper-bg)] rounded-lg"
                  layoutId="page-button-bg"
                />
              )}
            </button>
          ))}
        </div>

        <button
          className="text-[12px] whitespace-nowrap py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors flex flex-row gap-1 items-center group disabled:opacity-40 disabled:hover:bg-white"
          onClick={goToNextPage}
          disabled={!hasNextPage}
        >
          <span
            className={cx(
              'opacity-50 group-hover:opacity-100 hidden lg:block',
              !hasNextPage && 'group-hover:opacity-40'
            )}
          >
            {nextLabel}
          </span>{' '}
          <IconLineArrow direction="right" />
        </button>
      </div>
    </motion.div>
  );
};

export default Pagination;
