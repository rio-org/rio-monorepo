import { motion } from 'framer-motion'
import React, { useState } from 'react'
import IconLineArrow from '../Icons/IconLineArrow'
import cx from 'classnames'

type Props = {
  pages: number[];
  page: number;
  hasNextPage: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handlePageNum: (pageNum: number) => void;
}

const Pagination = ({ pages, page, hasNextPage, handlePreviousPage, handleNextPage, handlePageNum }: Props) => {
  const [buttonHoverIndex, setButtonHoverIndex] = useState<number | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const prevLabel = 'Previous';
  const nextLabel = 'Next';

  return (
    <motion.div
      layoutId='pagination'
    >
      <div className="bg-white w-full flex items-center justify-between border-t border-blue-gray-50 p-4 rounded-b-xl">
        <button
          className="text-[12px] whitespace-nowrap py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors flex flex-row gap-1 items-center group disabled:opacity-40 disabled:hover:bg-white"
          onClick={() => handlePreviousPage()}
          disabled={page === 0}
        >
          <IconLineArrow direction="left" />{' '}
          <span className={cx("opacity-50 group-hover:opacity-100 hidden lg:block",
            page === 0 && 'group-hover:opacity-40'
          )}>
            {prevLabel}
          </span>
        </button>
        <div className="flex items-center justify-center gap-3 lg:gap-1 w-full">
          {pages.map((i) => (
            <button
              key={i}
              className={cx(
                'text-[12px] py-1 px-2 rounded-lg opacity-50 transition-colors relative',
              )}
              onClick={() => handlePageNum(i)}
              onMouseOver={() => {
                setIsButtonHovered(true)
                setButtonHoverIndex(i)
              }}
              onMouseLeave={() => {
                setIsButtonHovered(false)
                setButtonHoverIndex(null)
              }}
            >
              <span className='relative z-10'>{i + 1}</span>
              {(isButtonHovered && buttonHoverIndex === i) && (
                <motion.div
                  className='absolute z-0 inset-0 bg-[var(--color-element-wrapper-bg)] rounded-lg'
                  layoutId='page-button-bg'
                />
              )}
              {!isButtonHovered && page === i && (
                <motion.div
                  className='absolute z-0 inset-0 bg-[var(--color-element-wrapper-bg)] rounded-lg'
                  layoutId='page-button-bg'
                />
              )}
            </button>
          ))}
        </div>

        <button
          className="text-[12px] whitespace-nowrap py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors flex flex-row gap-1 items-center group disabled:opacity-40 disabled:hover:bg-white"
          onClick={() => handleNextPage()}
          disabled={!hasNextPage}
        >
          <span className={cx("opacity-50 group-hover:opacity-100 hidden lg:block",
            !hasNextPage && 'group-hover:opacity-40'
          )}>
            {nextLabel}
          </span>{' '}
          <IconLineArrow direction="right" />
        </button>
      </div>
    </motion.div>
  )
}

export default Pagination